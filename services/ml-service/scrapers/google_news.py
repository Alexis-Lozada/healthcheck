import feedparser
import time
from datetime import datetime
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from newspaper import Article
from utils.db_utils import (
    get_or_create_source, save_news, get_active_model, 
    save_classification, classify_topic, extract_keywords, 
    save_news_keywords, find_existing_news_by_url
)
from core.classify_service import predict_news
from database.db import db
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

class GoogleNewsScraper:
    def __init__(self):
        # Configurar Selenium en modo headless
        self.options = webdriver.ChromeOptions()
        self.options.add_argument("--headless")
        self.options.add_argument("--ignore-certificate-errors")
        self.options.add_argument("--disable-blink-features=AutomationControlled")  # Evita detección como bot
        self.driver = None
        
    def _init_driver(self):
        """Inicializa el driver de Selenium solo cuando es necesario"""
        if self.driver is None:
            self.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()), 
                options=self.options
            )
    
    def close_driver(self):
        """Cierra el driver de Selenium"""
        if self.driver:
            self.driver.quit()
            self.driver = None
    
    def get_actual_url(self, google_link):
        """Obtiene la URL real a partir del enlace de Google News"""
        self._init_driver()
        try:
            self.driver.get(google_link)
            time.sleep(3)  # Esperar la redirección automática
            return self.driver.current_url
        except Exception as e:
            logger.error(f"Error al obtener URL real: {str(e)}")
            return None
            
    def scrape_news(self, rss_url=None, limit=5):
        """
        Scrape noticias de Google News, las clasifica y guarda en la base de datos.
        
        Args:
            rss_url (str): URL del feed RSS de Google News
            limit (int): Número máximo de noticias a procesar
            
        Returns:
            list: Lista de IDs de noticias procesadas
        """
        if rss_url is None:
            # URL predeterminada - noticias de salud en español
            rss_url = "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNR3QwTlRFU0JtVnpMVFF4T1NnQVAB?hl=es-419&gl=MX&ceid=MX%3Aes-419"
        
        # Inicializar driver
        self._init_driver()
        
        # Obtener el feed
        feed = feedparser.parse(rss_url)
        
        # Lista para almacenar los IDs de las noticias procesadas
        processed_news_ids = []
        
        # Procesar las noticias
        for entry in feed.entries[:limit]:
            try:
                titulo = entry.title
                link_google = entry.link
                
                # Seguir la redirección para obtener la URL real
                real_url = self.get_actual_url(link_google)
                
                if not real_url:
                    continue
                
                # Verificar si la noticia ya existe en la base de datos
                existing_news = find_existing_news_by_url(real_url)
                if existing_news:
                    logger.info(f"Noticia con URL {real_url} ya existe en la BD con ID {existing_news.id}")
                    processed_news_ids.append(existing_news.id)
                    continue
                
                # Extraer el contenido de la noticia
                try:
                    articulo = Article(real_url, language="es")
                    articulo.download()
                    articulo.parse()
                    
                    # Extraer contenido completo y fecha
                    contenido = articulo.text
                    fecha_publicacion = articulo.publish_date
                    
                    # Si la noticia no tiene contenido, saltarla
                    if not contenido or len(contenido) < 100:
                        logger.warning(f"Contenido demasiado corto para: {real_url}")
                        continue
                        
                    # 1. Obtener o crear la fuente
                    fuente_id = get_or_create_source(real_url)
                    
                    # 2. Clasificar el tema
                    tema_nombre, tema_id = classify_topic(contenido)
                    
                    # 3. Guardar la noticia
                    noticia_id = save_news(
                        titulo,
                        contenido,
                        real_url,
                        fecha_publicacion,
                        fuente_id,
                        tema_id
                    )
                    
                    # 4. Extraer y guardar keywords
                    keywords = extract_keywords(contenido, num_keywords=5)
                    save_news_keywords(noticia_id, keywords)
                    
                    # 5. Clasificar la noticia (verdadera/falsa)
                    resultado, confianza, explicacion = predict_news(contenido)
                    modelo_id = get_active_model()
                    
                    # 6. Guardar la clasificación
                    clasificacion_id = save_classification(
                        noticia_id, 
                        modelo_id, 
                        resultado, 
                        confianza, 
                        explicacion
                    )
                    
                    # Añadir a la lista de procesados
                    processed_news_ids.append(noticia_id)
                    
                    logger.info(f"Noticia procesada: {titulo} | Clasificación: {resultado} ({confianza}%)")
                    
                except Exception as e:
                    logger.error(f"Error al procesar artículo de {real_url}: {str(e)}")
                    continue
                    
            except Exception as e:
                logger.error(f"Error al procesar entrada de feed: {str(e)}")
                continue
                
        # Cerrar el driver
        self.close_driver()
        
        return processed_news_ids
    
    def get_news_without_saving(self, rss_url=None, limit=5):
        """
        Scrape noticias de Google News, las clasifica pero NO las guarda en la base de datos.
        En su lugar, devuelve los resultados como una lista de diccionarios.
        
        Args:
            rss_url (str): URL del feed RSS de Google News
            limit (int): Número máximo de noticias a procesar
            
        Returns:
            list: Lista de diccionarios con los datos de las noticias
        """
        if rss_url is None:
            # URL predeterminada - noticias de salud en español
            rss_url = "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNR3QwTlRFU0JtVnpMVFF4T1NnQVAB?hl=es-419&gl=MX&ceid=MX%3Aes-419"
        
        # Inicializar driver
        self._init_driver()
        
        # Obtener el feed
        feed = feedparser.parse(rss_url)
        
        # Lista para almacenar los resultados
        results = []
        
        # Procesar las noticias
        for entry in feed.entries[:limit]:
            try:
                titulo = entry.title
                link_google = entry.link
                
                # Seguir la redirección para obtener la URL real
                real_url = self.get_actual_url(link_google)
                
                if not real_url:
                    continue
                
                # Extraer el contenido de la noticia
                try:
                    articulo = Article(real_url, language="es")
                    articulo.download()
                    articulo.parse()
                    
                    # Extraer contenido completo y fecha
                    contenido = articulo.text
                    fecha_publicacion = articulo.publish_date
                    
                    # Si la noticia no tiene contenido, saltarla
                    if not contenido or len(contenido) < 100:
                        logger.warning(f"Contenido demasiado corto para: {real_url}")
                        continue
                    
                    # Obtener nombre de la fuente a partir de la URL
                    parsed_url = urlparse(real_url)
                    fuente = parsed_url.netloc.replace('www.', '')
                    
                    # Clasificar el tema
                    tema_nombre, _ = classify_topic(contenido)
                    
                    # Extraer keywords
                    keywords = extract_keywords(contenido, num_keywords=5)
                    
                    # Clasificar la noticia (verdadera/falsa)
                    resultado, confianza, explicacion = predict_news(contenido)
                    
                    # Crear objeto de resultado
                    news_item = {
                        "titulo": titulo,
                        "url": real_url,
                        "fecha_publicacion": fecha_publicacion.isoformat() if fecha_publicacion else None,
                        "fuente": fuente,
                        "contenido": contenido,
                        "tema": tema_nombre,
                        "clasificacion": resultado,
                        "confianza": confianza,
                        "explicacion": explicacion,
                        "palabras_clave": keywords
                    }
                    
                    # Añadir a la lista de resultados
                    results.append(news_item)
                    
                    logger.info(f"Noticia analizada (sin guardar): {titulo} | Clasificación: {resultado} ({confianza}%)")
                    
                except Exception as e:
                    logger.error(f"Error al procesar artículo de {real_url}: {str(e)}")
                    continue
                    
            except Exception as e:
                logger.error(f"Error al procesar entrada de feed: {str(e)}")
                continue
                
        # Cerrar el driver
        self.close_driver()
        
        return results