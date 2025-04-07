from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from config import Config

db = SQLAlchemy()

def init_db(app):
    """Inicializa la base de datos con SQLAlchemy."""
    app.config["SQLALCHEMY_DATABASE_URI"] = Config.SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = Config.SQLALCHEMY_TRACK_MODIFICATIONS
    
    # Configuración adicional para el pool de conexiones
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,  # Verifica que la conexión esté viva antes de usarla
        "pool_recycle": 300,    # Recicla conexiones después de 5 minutos
        "pool_timeout": 30,     # Tiempo máximo de espera para obtener una conexión
        "pool_size": 10,        # Tamaño inicial del pool
        "max_overflow": 20      # Conexiones adicionales permitidas
    }
    
    db.init_app(app)