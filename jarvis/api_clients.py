from pathlib import Path
from groq import Groq
from google import genai
from google.genai import types
from config import Config
import urllib.parse
import requests

class APIClientFactory:
    def __init__(self):
        Config.validate()
        self.groq = Groq(api_key=Config.GROQ_API_KEY)
        self.gemini = genai.Client(api_key=Config.GEMINI_API_KEY)
        self.maps_key = Config.MAPS_API_KEY

    def fetch_static_map(self, origin, destination, save_path="cache_map.png"):
        """
        Descarga una matriz de 3x3 teselas oscuras de OpenStreetMap (CartoDB),
        las unifica en una sola imagen de alta resolución y extrae un cuadrante 
        de 500x500 centrado exactamente en Santiago, RD.
        100% Gratis, Sin API Keys, Sin Billing Accounts.
        """
        try:
            import requests
            import math
            from PIL import Image
            from io import BytesIO

            # 1. Coordenadas base del área metropolitana de Santiago, RD
            lat = 19.4517
            lon = -70.6970
            zoom = 14
            
            # 2. Calcular los índices X e Y de la tesela central en la cuadrícula OSM
            lat_rad = math.radians(lat)
            n = 2.0 ** zoom
            center_x = int((lon + 180.0) / 360.0 * n)
            center_y = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)

            # Cada tesela mide 256x256 píxeles. Una matriz de 3x3 nos da 768x768 píxeles.
            tile_size = 256
            stitched_image = Image.new('RGB', (tile_size * 3, tile_size * 3))
            
            headers = {
                "User-Agent": "JarvisOSDashboard/1.0 (Systems Integration; Linux; EslenderOS)"
            }

            print("[MAP ENGINE]: Iniciando descarga de la cuadrícula de mosaicos urbanos...")

            # 3. Descargar la matriz de 3x3 teselas alrededor del centro
            # Iteramos de -1 a 1 para cubrir los cuadrantes adyacentes (Norte, Sur, Este, Oeste...)
            for i in range(-1, 2):
                for j in range(-1, 2):
                    tx = center_x + i
                    ty = center_y + j
                    
                    # Usamos el servidor de CartoDB Dark Matter para mantener la estética oscura de JARVIS
                    url = f"https://basemaps.cartocdn.com/dark_all/{zoom}/{tx}/{ty}.png"
                    
                    response = requests.get(url, headers=headers, timeout=5)
                    if response.status_code == 200:
                        tile_data = Image.open(BytesIO(response.content))
                        # Calculamos la posición exacta de pegado en nuestro lienzo de 768x768
                        pos_x = (i + 1) * tile_size
                        pos_y = (j + 1) * tile_size
                        stitched_image.paste(tile_data, (pos_x, pos_y))
                    else:
                        print(f"[MAP ENGINE WARNING]: Error descargando mosaico {tx},{ty}. Usando cuadro vacío.")

            # 4. Recortar el centro exacto de 500x500 píxeles para tu pantalla de 5"
            # El centro del lienzo de 768x768 es (384, 384)
            canvas_width, canvas_height = stitched_image.size
            crop_width, crop_height = 500, 500
            
            left = (canvas_width - crop_width) // 2
            top = (canvas_height - crop_height) // 2
            right = left + crop_width
            bottom = top + crop_height
            
            final_map = stitched_image.crop((left, top, right, bottom))
            
            # 5. Guardar la imagen en el buffer local del proyecto
            final_map.save(save_path, "PNG")
            print(f"[MAP ENGINE SUCCESS]: Mapeo de Santiago consolidado con éxito en '{save_path}'.")
            return True

        except Exception as e:
            print(f"[OSM STITCH ENGINE FAULT]: Error crítico cosiendo las teselas: {e}")
            return False
        
    def _fetch_emergency_tile_fallback(self, save_path):
        """Descarga un cuadrante de mapa base directamente de OSM en caso de emergencia."""
        try:
            import requests
            # Descarga un tile directo del centro de Santiago (X/Y de OSM para Zoom 14)
            url = "https://tile.openstreetmap.org/14/4974/7321.png"
            headers = {"User-Agent": "JarvisOSDashboard/1.0"}
            response = requests.get(url, headers=headers, timeout=5)
            if response.status_code == 200:
                # Escalamos la imagen de 256x256 a 500x500 nativos de Pygame si es necesario,
                # pero guardarla directamente permite que Pygame la procese.
                with open(save_path, "wb") as f:
                    f.write(response.content)
                return True
            return False
        except:
            return False
        
    def execute_groq(self, prompt: str) -> str:
        try:
            completion = self.groq.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=Config.TEXT_MODEL,
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"Inference Pipeline Error [Groq]: {str(e)}"

    def execute_gemini(self, prompt: str, image_path: str = None) -> str:
        try:
            contents = [prompt]
            if image_path:
                file_path = Path(image_path)
                if file_path.exists():
                    contents.append(types.Part.from_bytes(data=file_path.read_bytes(), mime_type="image/jpeg"))
            response = self.gemini.models.generate_content(model=Config.MULTIMODAL_MODEL, contents=contents)
            return response.text
        except Exception as e:
            return f"Inference Pipeline Error [Gemini]: {str(e)}"