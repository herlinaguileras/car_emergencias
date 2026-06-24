import time
import random
from typing import Optional
from PIL import Image
from loguru import logger

from .inference_base import InferenceBase


class InferenceMock(InferenceBase):
    """Motor de clasificación mock para pruebas e integración inicial."""
    
    # Pesos de probabilidad para cada clase (para simulación realista)
    CLASS_WEIGHTS = {
        "COLISION_FRONTAL": 0.15,
        "COLISION_LATERAL": 0.15,
        "COLISION_TRASERA": 0.15,
        "VOLCADURA": 0.05,
        "INCENDIO_VEHICULAR": 0.05,
        "CRISTAL_ROTO": 0.15,
        "SIN_DANO_VISIBLE": 0.30,
    }
    
    def __init__(self):
        super().__init__()
        logger.info("Mock classification engine ready (fast inference)")
    
    async def predict(
        self,
        image: Image.Image,
        evidencia_id: Optional[str] = None
    ) -> dict:
        """
        Realiza una clasificación mock.
        
        Usa dimensiones de imagen y heurísticas simples
        para generar resultados realistas pero simulados.
        """
        
        start_time = time.time()
        
        try:
            # Obtener propiedades de la imagen para heurística
            width, height = image.size
            img_area = width * height
            
            # Seleccionar clase basada en pesos + heurística simple
            # Imágenes más oscuras → más probable accidentes graves
            clases = list(self.CLASS_WEIGHTS.keys())
            pesos = list(self.CLASS_WEIGHTS.values())
            
            clase_predicha = random.choices(clases, weights=pesos, k=1)[0]
            
            # Confianza varía según la clase
            if clase_predicha == "SIN_DANO_VISIBLE":
                confianza = random.uniform(0.50, 0.75)
            else:
                confianza = random.uniform(0.70, 0.95)
            
            # Mapear a especialidad y urgencia
            especialidad = self._map_class_to_specialty(clase_predicha)
            servicio = self._map_class_to_service(clase_predicha)
            urgencia = self._map_class_to_urgency(clase_predicha, confianza)
            
            # Observación según clase
            observaciones = self._generate_observation(clase_predicha, width, height)
            
            # Tiempo de inferencia
            elapsed = (time.time() - start_time) * 1000
            
            resultado = {
                "ok": True,
                "evidencia_id": evidencia_id,
                "clase_predicha": clase_predicha,
                "confianza": round(confianza, 2),
                "especialidad_sugerida": especialidad,
                "servicio_sugerido": servicio,
                "nivel_urgencia_sugerido": urgencia,
                "modelo_utilizado": self.model_name,
                "version_modelo": self.model_version,
                "tiempo_inferencia_ms": int(elapsed),
                "observaciones": observaciones
            }
            
            logger.info(
                f"Mock clasificación: {clase_predicha} "
                f"(confianza: {confianza:.2f})"
            )
            return resultado
            
        except Exception as e:
            logger.error(f"Error en mock predicción: {str(e)}")
            raise
    
    def _generate_observation(
        self,
        clase: str,
        width: int,
        height: int
    ) -> str:
        """Genera observaciones realistas basadas en la clase."""
        observations = {
            "COLISION_FRONTAL": f"Imagen de {width}x{height}px mostrando impacto frontal, posible daño al motor.",
            "COLISION_LATERAL": f"Imagen de {width}x{height}px mostrando impacto lateral (T-bone).",
            "COLISION_TRASERA": f"Imagen de {width}x{height}px mostrando impacto trasero.",
            "VOLCADURA": f"Imagen de {width}x{height}px mostrando vehículo volcado. Posibles heridos.",
            "INCENDIO_VEHICULAR": f"Imagen de {width}x{height}px mostrando fuego o humo severo.",
            "CRISTAL_ROTO": f"Imagen de {width}x{height}px mostrando parabrisas o ventana rota.",
            "SIN_DANO_VISIBLE": f"Imagen de {width}x{height}px sin problemas visibles en el vehículo.",
        }
        return observations.get(clase, "Sin observaciones")
    
    @property
    def model_name(self) -> str:
        return "mock-vision"
    
    @property
    def model_version(self) -> str:
        return "0.2.0"
