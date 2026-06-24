from abc import ABC, abstractmethod
from typing import Optional
from PIL import Image
from loguru import logger


class InferenceBase(ABC):
    """Clase base para motores de clasificación de imágenes."""
    
    # Clases disponibles para clasificación
    AVAILABLE_CLASSES = [
        "COLISION_FRONTAL",
        "COLISION_LATERAL",
        "COLISION_TRASERA",
        "VOLCADURA",
        "INCENDIO_VEHICULAR",
        "CRISTAL_ROTO",
        "SIN_DANO_VISIBLE"
    ]
    
    def __init__(self):
        logger.info(f"Inicializando {self.__class__.__name__}")
    
    @abstractmethod
    async def predict(
        self,
        image: Image.Image,
        evidencia_id: Optional[str] = None
    ) -> dict:
        """
        Clasifica una imagen en una de las clases disponibles.
        
        Args:
            image: Imagen PIL
            evidencia_id: ID opcional de evidencia
        
        Returns:
            Diccionario con clase predicha y confianza
        """
        pass
    
    @property
    @abstractmethod
    def model_name(self) -> str:
        """Nombre del modelo utilizado."""
        pass
    
    @property
    @abstractmethod
    def model_version(self) -> str:
        """Versión del modelo."""
        pass
    
    @staticmethod
    def _map_class_to_specialty(class_name: str) -> Optional[str]:
        """Mapea clase predicha a especialidad sugerida."""
        mapping = {
            "COLISION_FRONTAL": "CHAPERIA_CARROCERIA",
            "COLISION_LATERAL": "CHAPERIA_CARROCERIA",
            "COLISION_TRASERA": "CHAPERIA_CARROCERIA",
            "VOLCADURA": "RESCATE_Y_GRUA_PESADA",
            "INCENDIO_VEHICULAR": "BOMBEROS_Y_RESCATE",
            "CRISTAL_ROTO": "CRISTALERIA_AUTOMOTRIZ",
            "SIN_DANO_VISIBLE": None,
        }
        return mapping.get(class_name)
    
    @staticmethod
    def _map_class_to_service(class_name: str) -> Optional[str]:
        """Mapea clase predicha a servicio sugerido."""
        mapping = {
            "COLISION_FRONTAL": "REMOLQUE_GRUA",
            "COLISION_LATERAL": "REMOLQUE_GRUA",
            "COLISION_TRASERA": "REMOLQUE_GRUA",
            "VOLCADURA": "AMBULANCIA_Y_GRUA",
            "INCENDIO_VEHICULAR": "BOMBEROS",
            "CRISTAL_ROTO": "TALLER_VIDRIOS",
            "SIN_DANO_VISIBLE": None,
        }
        return mapping.get(class_name)
    
    @staticmethod
    def _map_class_to_urgency(class_name: str, confidence: float) -> str:
        """Mapea clase predicha a nivel de urgencia."""
        urgency_map = {
            "COLISION_FRONTAL": "ALTA",
            "COLISION_LATERAL": "ALTA",
            "COLISION_TRASERA": "MEDIA",
            "VOLCADURA": "CRITICA",
            "INCENDIO_VEHICULAR": "CRITICA",
            "CRISTAL_ROTO": "BAJA",
            "SIN_DANO_VISIBLE": "NINGUNA",
        }
        return urgency_map.get(class_name, "MEDIA")
