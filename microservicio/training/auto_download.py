import os
import requests
from pathlib import Path
#pyrefly: ignore [missing-import]
from duckduckgo_search import DDGS
from time import sleep

CLASES_Y_BUSQUEDAS = {
    "COLISION_FRONTAL": ["car front bumper damage", "car frontal crash accident"],
    "COLISION_LATERAL": ["car side damage crash", "t bone car accident"],
    "COLISION_TRASERA": ["car rear end damage", "rear ended car crash"],
    "VOLCADURA": ["car rollover accident", "overturned car on road"],
    "INCENDIO_VEHICULAR": ["car on fire accident", "burning vehicle on road"],
    "CRISTAL_ROTO": ["broken car windshield", "shattered car window"],
    "SIN_DANO_VISIBLE": ["normal parked car", "car driving on highway"]
}

MAX_IMAGENES_POR_CLASE = 60 # Ajustado para una descarga más rápida
BASE_DIR = Path(__file__).parent.parent / "dataset" / "processed"

def descargar_imagenes():
    ddgs = DDGS()
    
    for clase, terminos in CLASES_Y_BUSQUEDAS.items():
        carpeta_destino = BASE_DIR / clase
        carpeta_destino.mkdir(parents=True, exist_ok=True)
        print(f"\n[INICIANDO] Buscando imagenes para la clase: {clase}")
        
        contador = 1
        for termino in terminos:
            print(f"  Buscando término: '{termino}'...")
            try:
                resultados = ddgs.images(termino, max_results=MAX_IMAGENES_POR_CLASE//len(terminos))
                for img in resultados:
                    url = img['image']
                    try:
                        respuesta = requests.get(url, timeout=5)
                        if respuesta.status_code == 200:
                            ruta_archivo = carpeta_destino / f"{clase.lower()}_{contador}.jpg"
                            with open(ruta_archivo, 'wb') as f:
                                f.write(respuesta.content)
                            contador += 1
                            print(f"    [EXITO] Descargada: {ruta_archivo.name}")
                    except Exception:
                        continue 
                    sleep(0.5) 
            except Exception as e:
                print(f"Error buscando '{termino}': {e}")
                
        print(f"[FINALIZADO] para {clase}: {contador-1} imagenes descargadas.")

if __name__ == "__main__":
    descargar_imagenes()
