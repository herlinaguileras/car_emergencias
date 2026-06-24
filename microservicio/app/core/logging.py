import sys
from loguru import logger

from .config import settings

def setup_logging():
    """Configura loguru para el servicio."""
    
    # Eliminar handlers predeterminados
    logger.remove()
    
    # Si estamos en producción, el log va en formato JSON para que sea indexable
    is_prod = settings.app_env.lower() == "production"
    
    # Configurar formato para desarrollo local
    dev_format = (
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
        "<level>{message}</level>"
    )
    
    # Handler principal (stdout)
    logger.add(
        sys.stdout,
        format=dev_format if not is_prod else "{message}",
        level=settings.log_level,
        colorize=not is_prod,
        serialize=is_prod  # Esto convierte cada log en un objeto JSON en producción
    )
    
    # Archivo de logs rotativo y estructurado
    logger.add(
        "logs/vision_service.log",
        format="{message}",
        level=settings.log_level,
        rotation="100 MB",
        retention="7 days",
        serialize=True,  # El archivo de log siempre debe ser JSON para análisis
        enqueue=True     # Thread-safe para async FastAPI
    )
    
    return logger
