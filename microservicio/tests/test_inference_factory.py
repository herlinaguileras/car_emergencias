import pytest
from unittest.mock import patch
from app.services.inference_factory import get_inference_engine, create_inference_engine
from app.services.inference_mock import InferenceMock
from app.core import settings

def test_inference_engine_singleton():
    """Prueba que el factory retorne siempre la misma instancia (Singleton)."""
    # Limpiar caché por si otra prueba lo inicializó
    get_inference_engine.cache_clear()
    
    settings.model_provider = "mock"
    engine1 = get_inference_engine()
    engine2 = get_inference_engine()
    
    assert engine1 is engine2
    assert isinstance(engine1, InferenceMock)

def test_inference_engine_factory():
    """Prueba que el factory cree el modelo correcto según la configuración."""
    settings.model_provider = "mock"
    engine = create_inference_engine()
    assert isinstance(engine, InferenceMock)
