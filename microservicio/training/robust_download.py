from icrawler.builtin import GoogleImageCrawler, BingImageCrawler
from pathlib import Path
import shutil

CLASES_Y_BUSQUEDAS = {
    "COLISION_FRONTAL": "front bumper car crash accident real",
    "COLISION_LATERAL": "side car crash t-bone accident real",
    "COLISION_TRASERA": "rear end car crash damage",
    "VOLCADURA": "overturned rolled over car accident",
    "INCENDIO_VEHICULAR": "car burning on fire road",
    "CRISTAL_ROTO": "smashed car windshield broken glass",
    "SIN_DANO_VISIBLE": "normal parked car clean street" # Búsqueda muy específica para evitar basura
}

MAX_IMAGENES = 80
BASE_DIR = Path(__file__).parent.parent / "dataset" / "processed"

def descargar_con_icrawler():
    for clase, keyword in CLASES_Y_BUSQUEDAS.items():
        carpeta_destino = BASE_DIR / clase
        
        # Si la carpeta existía y tenía basura (como tu queja de SIN_HALLAZGOS_CLAROS), la limpiamos
        if clase == "SIN_DANO_VISIBLE" and carpeta_destino.exists():
            shutil.rmtree(carpeta_destino)
            
        carpeta_destino.mkdir(parents=True, exist_ok=True)
        print(f"\n[+] Descargando imágenes de alta calidad para: {clase}")
        
        # Usamos Bing que tiene menos bloqueos que Google para descargas masivas
        crawler = BingImageCrawler(storage={'root_dir': str(carpeta_destino)})
        
        # Filtros: solo fotos a color
        crawler.crawl(
            keyword=keyword, 
            max_num=MAX_IMAGENES,
            filters={'type': 'photo', 'color': 'color'}
        )
        print(f"[-] Fin de descarga para {clase}")

if __name__ == "__main__":
    descargar_con_icrawler()
