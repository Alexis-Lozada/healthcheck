# 🩺 HealthCheck - API de Detección de Noticias Falsas

Bienvenido a **HealthCheck**, un sistema diseñado para detectar **noticias falsas** en el ámbito de la salud utilizando **Machine Learning (ML)**.  
Este repositorio contiene el servicio `ml-service`, que permite analizar noticias mediante texto o URL utilizando un modelo basado en **BERT**.  

📌 **Nota:** Este es el primer servicio del sistema, y en el futuro se agregarán más módulos.  

---

## **📌 Servicios Disponibles**  

✅ `ml-service` - **Análisis de Noticias Falsas con BERT** (Servicio Actual)  
❌ `data-service` - **Próximo Servicio**  
❌ `user-service` - **Próximo Servicio**  

*(Los servicios pendientes se agregarán en futuras versiones del sistema.)*  

---

# **🚀 Instalación y Configuración**  

## **1️⃣ Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/healthcheck.git
cd healthcheck/services/ml-service
```

---

## **2️⃣ Configurar entorno virtual**  
Antes de instalar las dependencias, debes crear y activar un entorno virtual:  

📌 **En Windows**  
```bash
python -m venv venv
venv\Scripts\activate
```

📌 **En macOS/Linux**  
```bash
python3 -m venv venv
source venv/bin/activate
```

---

## **3️⃣ Instalar dependencias**
Después de activar el entorno virtual, instala las dependencias necesarias:  
```bash
pip install -r requirements.txt
```

---

## **4️⃣ Descargar archivos grandes con Git LFS**
Este servicio usa **Git LFS** para manejar los archivos del modelo (que superan los 100MB).  
Para asegurarte de tener los archivos necesarios, ejecuta:
```bash
git lfs pull
```
Si no tienes **Git LFS** instalado, instálalo con:
```bash
git lfs install
```

---

## **5️⃣ Ejecutar el servicio `ml-service`**
```bash
python app.py
```
La API se ejecutará en `http://127.0.0.1:5000` 🚀

---

# **🛠 Uso de la API**
Este servicio permite clasificar noticias como **reales o falsas** mediante texto o URL.  

## **📌 1️⃣ Probar con texto (cURL)**
```bash
curl -X POST "http://127.0.0.1:5000/predict" -H "Content-Type: application/json" -d '{"text": "Los científicos han demostrado que las vacunas contra COVID-19 son seguras y efectivas."}'
```
📌 **Ejemplo de Respuesta**
```json
{
    "Fuente": "Texto ingresado directamente",
    "Texto Analizado": "Los científicos han demostrado que las vacunas contra COVID-19 son seguras y efectivas.",
    "Clasificación": "Real",
    "Confianza": 98.34,
    "Explicación": "La noticia parece confiable."
}
```

---

## **📌 2️⃣ Probar con una URL (cURL)**
```bash
curl -X POST "http://127.0.0.1:5000/predict" -H "Content-Type: application/json" -d '{"url": "https://www.bbc.com/news/health-65542832"}'
```
📌 **Ejemplo de Respuesta**
```json
{
    "Fuente": "https://www.bbc.com/news/health-65542832",
    "Texto Analizado": "Investigadores han confirmado que las vacunas...",
    "Clasificación": "Real",
    "Confianza": 96.12,
    "Explicación": "La noticia parece confiable."
}
```

---

# **🛠 Desarrollo y Contribución**  
Si deseas contribuir al proyecto:  
1. **Crea una rama nueva**  
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
2. **Haz cambios y commitea**  
   ```bash
   git add .
   git commit -m "feat: Nueva funcionalidad agregada"
   ```
3. **Sube los cambios**  
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
4. **Abre un Pull Request en GitHub**  

---

# **📌 Próximos Servicios en HealthCheck**
🛠 **data-service** - Almacenamiento y gestión de noticias analizadas  
🛠 **user-service** - Administración de usuarios y accesos  

*(Más detalles próximamente... 🚀)*  

---

# **📩 Contacto**
Si tienes dudas o quieres colaborar en el proyecto, contáctanos:  
📧 **Email:** soporte@healthcheck.com  
🌎 **Repositorio:** [GitHub - HealthCheck](https://github.com/tu-usuario/healthcheck)  

🚀 **¡Gracias por contribuir a un mundo con información más confiable!** 😃🎯

