from flask import Blueprint, request, jsonify
from core.classify_service import predict_news
from utils.article_extractor import extract_news_data
from utils.db_utils import (
    get_or_create_source, save_news, get_active_model, 
    save_classification, save_consultation, classify_topic, 
    extract_keywords, save_news_keywords, find_existing_news_by_url
)
import os
import requests
import logging

# Basic logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Google Search API configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CX = os.getenv("GOOGLE_CX")

# Create Blueprint
classify_bp = Blueprint("classify_bp", __name__)

def search_related_news(query, limit=5):
    """Search for related news using Google Search API."""
    if not GOOGLE_API_KEY or not GOOGLE_CX:
        logger.warning("Google Search API credentials not configured")
        return []
    
    # Domains to exclude (non-news sites)
    excluded_domains = [
        'youtube.com', 'youtu.be', 'facebook.com', 'instagram.com', 
        'twitter.com', 'x.com', 'tiktok.com', 'linkedin.com',
        'reddit.com', 'pinterest.com', 'wikipedia.org'
    ]
    
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "q": f"{query} noticias",
            "key": GOOGLE_API_KEY,
            "cx": GOOGLE_CX,
            "num": limit + 5,  # Request more to account for filtered results
            "lr": "lang_es",   # Restrict to Spanish language results
            "gl": "mx"         # Geographic location: Mexico (for Spanish content priority)
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            items = data.get("items", [])
            
            related_news = []
            processed_count = 0
            
            for item in items:
                if processed_count >= limit:
                    break
                    
                news_url = item.get("link", "")
                title = item.get("title", "")
                snippet = item.get("snippet", "")
                
                # Check if URL is from excluded domain
                is_excluded = any(domain in news_url.lower() for domain in excluded_domains)
                if is_excluded:
                    logger.debug(f"Skipping excluded domain: {news_url}")
                    continue
                
                # Try to classify each related news
                classification = "unknown"
                confidence = 0
                
                try:
                    # Try to extract and classify the article
                    extracted_data = extract_news_data(news_url)
                    if extracted_data and extracted_data.get("Texto Completo"):
                        result, conf, _ = predict_news(extracted_data["Texto Completo"])
                        classification = result
                        confidence = conf
                except Exception as e:
                    logger.debug(f"Could not classify related news {news_url}: {str(e)}")
                
                related_news.append({
                    "title": title,
                    "snippet": snippet,
                    "url": news_url,
                    "classification": classification,
                    "confidence": confidence
                })
                
                processed_count += 1
            
            return related_news
        else:
            logger.error(f"Google Search API error: {response.status_code}")
            return []
            
    except Exception as e:
        logger.error(f"Error searching related news: {str(e)}")
        return []

@classify_bp.route("/predict", methods=["POST"])
def classify():
    """Receives news (text or URL), saves it to database and classifies it."""
    data = request.json

    if not data:
        return jsonify({"error": "Please send JSON with 'text' or 'url'"}), 400

    try:
        user_id = data.get("user_id", None)  # Optional user
        extracted_data = {}
        existing_news = None

        if "url" in data:
            # Check if news already exists in database
            existing_news = find_existing_news_by_url(data["url"])
            
            extracted_data = extract_news_data(data["url"])
            if not extracted_data:
                return jsonify({"error": "Could not extract content from URL."}), 400

            # Save source
            source_id = get_or_create_source(data["url"])
            text = extracted_data["Texto Completo"]

        elif "text" in data:
            text = data["text"]
            extracted_data = {
                "Título": "Not available",
                "Texto Completo": text,
                "Autor": "Unknown",
                "Fecha de Publicación": None
            }
            source_id = None
        else:
            return jsonify({"error": "JSON must contain 'text' or 'url'."}), 400

        # If news already exists, only register consultation
        if existing_news:
            news_id = existing_news.id
            logger.info(f"News with URL {data.get('url')} already exists in DB with ID {news_id}")
            
            # Get existing classification (assume it already has one)
            classification = existing_news.clasificaciones[0] if existing_news.clasificaciones else None
            
            if classification:
                result = classification.resultado
                confidence = float(classification.confianza) if classification.confianza is not None else 0
                explanation = classification.explicacion
                classification_id = classification.id
            else:
                # If no classification exists, classify now
                result, confidence, explanation = predict_news(text)
                model_id = get_active_model()
                classification_id = save_classification(news_id, model_id, result, confidence, explanation)
            
            # Get topic if exists
            topic_name = existing_news.tema.nombre if existing_news.tema else "Unclassified"
            
            # Register user consultation
            consultation_id = None
            if user_id:
                consultation_id = save_consultation(user_id, news_id)
                
            # Extract keywords from content for response
            keywords = extract_keywords(text)
            
            # Search for related news
            search_query = " ".join(keywords[:3]) if keywords else extracted_data.get("Título", "")
            related_news = search_related_news(search_query)
            
            return jsonify({
                "consultation_id": consultation_id,
                "news_id": news_id,
                "classification_id": classification_id,
                "source": data.get("url", "Direct text input"),
                **extracted_data,
                "classification": result,
                "confidence": confidence,
                "explanation": explanation,
                "topic": topic_name,
                "keywords": keywords,
                "related_news": related_news,
                "message": "News found in database"
            }), 200
            
        # STEP 1: Classify topic dynamically
        topic_name, topic_id = classify_topic(text)
        
        # STEP 2: Save news with topic
        news_id = save_news(
            extracted_data["Título"],
            extracted_data["Texto Completo"],
            data.get("url"),
            extracted_data["Fecha de Publicación"],
            source_id,
            topic_id
        )
        
        # STEP 3: Extract and save keywords
        keywords = extract_keywords(text)
        save_news_keywords(news_id, keywords)

        # STEP 4: Classify news as true or false
        result, confidence, explanation = predict_news(text)

        # Get active model
        model_id = get_active_model()
        if not model_id:
            return jsonify({"error": "No active model available for classification."}), 500

        # Save classification
        classification_id = save_classification(news_id, model_id, result, confidence, explanation)

        # STEP 5: Save in consultation history
        consultation_id = None
        if user_id:
            consultation_id = save_consultation(user_id, news_id)

        # STEP 6: Search for related news
        search_query = " ".join(keywords[:3]) if keywords else extracted_data.get("Título", "")
        related_news = search_related_news(search_query)

        return jsonify({
            "consultation_id": consultation_id,
            "news_id": news_id,
            "classification_id": classification_id,
            "source": data.get("url", "Direct text input"),
            **extracted_data,
            "classification": result,
            "confidence": confidence,
            "explanation": explanation,
            "topic": topic_name,
            "keywords": keywords,
            "related_news": related_news,
            "message": "New news processed and stored"
        }), 200
    
    except Exception as e:
        logger.error(f"Error during classification: {str(e)}")
        return jsonify({"error": f"Error during processing: {str(e)}"}), 500
