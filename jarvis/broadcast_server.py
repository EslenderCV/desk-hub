import asyncio
import json
import threading
import os
import psutil
import websockets
from config import Config
from elevenlabs.client import ElevenLabs

class JarvisBackendEngine:
    def __init__(self, factory, router):
        self.factory = factory
        self.router = router
        self.running = True

        # Variables de estado reactivo y telemetría
        self.current_state = "IDLE"
        self.visual_mode = "CORE"
        self.live_cpu = 0.0
        self.live_ram = 0.0

        # NUEVA INYECCIÓN: Coordenadas geográficas iniciales (Santiago, RD) en formato [Lng, Lat]
        self.map_coordinates = {
            "center": [-70.6970, 19.4517],
            "zoom": 14,
            "label": "SANTIAGO URBAN GRID"
        }

        # Proveedores de servicios multimedia y persistencia de disco
        self.audio_client = ElevenLabs(api_key=Config.ELEVENLABS_API_KEY)
        self.target_voice_id = "cjVigY5qzO86Huf0OWal"
        self.memory_file_path = "memory_ledger.json"
        self.cached_map_path = "cache_map.png"
        self.conversation_history = []
        self.max_memory_turns = 6
        self.credits_exhausted = False

        self._load_memory_from_disk()
        self.connected_clients = set()

    def _load_memory_from_disk(self):
        """Sincroniza el registro permanente de memoria desde el almacenamiento."""
        if os.path.exists(self.memory_file_path):
            try:
                with open(self.memory_file_path, "r", encoding="utf-8") as f:
                    self.conversation_history = json.load(f)
                print(f"[SYSTEM]: Permanent memory ledger synced. Loaded {len(self.conversation_history)} log entries.")
            except Exception as e:
                print(f"[MEMORY CORRUPTION WARNING]: {e}")
                self.conversation_history = []

    def _write_memory_to_disk(self):
        """Vuelca el historial cognitivo actual a disco."""
        try:
            with open(self.memory_file_path, "w", encoding="utf-8") as f:
                json.dump(self.conversation_history, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"[MEMORY DISK WRITE FAULT]: {e}")

    # ================================================================
    #   MANEJADORES ASÍNCRONOS DEL WEBSOCKET PIPELINE (WEBSOCKETS NATIVO)
    # ================================================================
    async def register_client(self, websocket):
        """Registra la conexión entrante de React y abre el canal de streaming."""
        self.connected_clients.add(websocket)
        try:
            # Enviar el estado actual inmediatamente tras conectar
            await websocket.send(self._build_json_payload())
            async for message in websocket:
                pass  # Mantener socket abierto escuchando (vacío por ahora)
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.connected_clients.remove(websocket)

    def _build_json_payload(self):
        """Construye la estructura de datos unificada que consume la UI en React."""
        audio_payload = {
            "title": "MOOD Player Inactivo",
            "artist": "Pipeline en Espera"
        }
        if self.visual_mode == "SPOTIFY":
            audio_payload = {
                "title": "El Bar de los Sufridos - Podcast Core",
                "artist": "Local Audio Session"
            }
            
        return json.dumps({
            "type": "SYSTEM_UPDATE",
            "state": self.current_state,
            "visualMode": self.visual_mode,
            "cpu": self.live_cpu,
            "ram": self.live_ram,
            "audio": audio_payload,
            "mapData": self.map_coordinates  # Inyección de coordenadas geográficas directas al JSON
        })

    async def push_system_update(self):
        """Realiza un broadcast masivo del estado a todos los clientes WebSockets activos."""
        if not self.connected_clients: 
            return
            
        self.live_cpu = psutil.cpu_percent()
        self.live_ram = psutil.virtual_memory().percent
        
        message = self._build_json_payload()
        await asyncio.gather(
            *[client.send(message) for client in self.connected_clients], 
            return_exceptions=True
        )

    async def telemetry_broadcast_loop(self):
        """Bucle asíncrono secundario periódico para refrescar el hardware en pantalla."""
        while self.running:
            await self.push_system_update()
            await asyncio.sleep(1.0)

    async def start_server(self):
        """Arranca la infraestructura del servidor de datos en el puerto 8000."""
        print("\n" + "="*60)
        print("[JARVIS CORE OS]: INITIALIZING WEBSOCKET FLOW")
        print(" -> Canal WebSockets Nativo Activo: ws://localhost:8000")
        print("="*60 + "\n")
        
        async with websockets.serve(self.register_client, "localhost", 8000):
            await self.telemetry_broadcast_loop()

    # ================================================================
    #   TERMINAL INTERACTIVA PRINCIPAL (HEADLESS INTERACTION)
    # ================================================================
    def run_console_interface(self):
        """Mantiene abierto el prompt en el hilo principal sin bloquear el bucle asíncrono."""
        print(" JARVIS HYBRID BACKEND ENGINE IS RUNNING SYSTEM LOOPS.")
        print(" Introduce tus consultas directamente abajo.")
        print("="*60 + "\n")
        
        # Guardamos la referencia al lazo asíncrono para enviar llamadas cruzadas seguras desde otros hilos
        self.main_loop = asyncio.get_event_loop()
        
        while self.running:
            try:
                user_text = input("\n[YOU]: ").strip()
                if not user_text:
                    continue
                
                if user_text.lower() in ["exit", "quit"]:
                    self.running = False
                    break

                if self.current_state in ["THINKING", "SPEAKING"]:
                    print("[SYSTEM REJECT]: El núcleo lógico está procesando una consulta en curso.")
                    continue

                # Notificamos el bloqueo cognitivo a React de inmediato
                self.current_state = "THINKING"
                asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)
                
                # Despachamos la inferencia pesada en un subproceso dedicado libre de bloqueos
                threading.Thread(
                    target=self._async_inference_pipeline, 
                    args=(user_text,), 
                    daemon=True
                ).start()
                
            except (KeyboardInterrupt, SystemExit):
                self.running = False
                break

    # ================================================================
    #   PIPELINE COGNITIVO ASÍNCRONO DE INFERENCIA (Mantiene toda tu lógica)
    # ================================================================
    def _async_inference_pipeline(self, user_input):
        """Maneja el ruteo de intenciones locales y ejecuciones remotas de LLM."""
        try:
            route_map = self.router.determine_route(user_input)
            engine_target = route_map.get("target")
            intent = route_map.get("intent", "")
            
            if "visual_mode" in route_map:
                self.visual_mode = route_map.get("visual_mode")

            # --- SISTEMA DE ACCIONES LOCALES ---
            if engine_target == "LOCAL_SYSTEM":
                if intent == "NAVIGATION_ROUTE":
                    # SUSTITUCIÓN CRÍTICA: En lugar de usar PIL y descargar imágenes, 
                    # actualizamos las coordenadas a un punto de tránsito real en Santiago de los Caballeros
                    print("[MAP ROUTING]: Calculando coordenadas vectoriales para Santiago, RD...")
                    self.map_coordinates = {
                        "center": [-70.6795, 19.4442],  # Coordenadas específicas en Santiago
                        "zoom": 15,
                        "label": "ROUTE: AV. RAFAEL VIDAL -> AV. DUARTE"
                    }

                spoken_text = self.router.execute_local_action(user_input, route_map)
                
                self.conversation_history.append(f"User: {user_input}")
                self.conversation_history.append(f"Jarvis: {spoken_text}")
                self._write_memory_to_disk()

                self._trigger_voice_and_state(spoken_text)
                return

            # --- RUNTIME GLOBAL DE MODELOS DE INFERENCIA DE TEXTO (Original) ---
            ui_system_instruction = (
                f"{Config.SYSTEM_PERSONA}\n\n"
                f"CURRENT HOST TELEMETRY:\n"
                f"- Host CPU Core Load: {self.live_cpu}%\n"
                f"- Host Memory Pressure: {self.live_ram}%\n\n"
                "CRITICAL OUTPUT FORMAT CONTRACT:\n"
                "You must respond strictly in valid JSON format. Do not include markdown wrappers.\n"
                "The JSON object must contain exactly these three keys:\n"
                "- 'ui_animation_state': String ('IDLE', 'THINKING', 'SPEAKING', 'ERROR').\n"
                "- 'spoken_response': A short, biting response.\n"
                "- 'display_metrics': A list containing exactly two data points."
            )

            api_safe_slice = self.conversation_history[-self.max_memory_turns * 2:] if self.conversation_history else []
            history_context = "PREVIOUS CONVERSATION CONTEXT:\n" + "\n".join(api_safe_slice) + "\n\n" if api_safe_slice else ""

            if engine_target == "GEMINI":
                full_prompt = f"{ui_system_instruction}\n\n{history_context}User Request: {user_input}"
                response_raw = self.factory.execute_gemini(full_prompt, image_path="test_frame.jpg")
            else:
                groq_messages = [{"role": "system", "content": ui_system_instruction}]
                if history_context:
                    groq_messages.append({"role": "system", "content": f"Review this log:\n{history_context}"})
                groq_messages.append({"role": "user", "content": user_input})

                completion = self.factory.groq.chat.completions.create(
                    messages=groq_messages,
                    model=Config.TEXT_MODEL,
                    response_format={"type": "json_object"}
                )
                response_raw = completion.choices[0].message.content

            parsed_json = json.loads(response_raw)
            spoken_text = parsed_json.get("spoken_response", "Fallo crítico al desempaquetar payload cognitivo.")
            self.current_state = parsed_json.get("ui_animation_state", "IDLE")
            
            print(f"\n[JARVIS INFERENCE]: {spoken_text}")
            
            self.conversation_history.append(f"User: {user_input}")
            self.conversation_history.append(f"Jarvis: {spoken_text}")
            self._write_memory_to_disk()

            # Forzamos la actualización inmediata del estado intermedio antes de hablar
            asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)
            self._trigger_voice_and_state(spoken_text)

        except Exception as e:
            print(f"\n[CORE PIPELINE FAULT INTERCEPTED]: {str(e)}")
            self.current_state = "ERROR"
            self.visual_mode = "CORE"
            asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)

    # ================================================================
    #   SUBSISTEMA MULTIMEDIA HEADLESS REPRODUCCIÓN AUDIO TTS (Original)
    # ================================================================
    def _trigger_voice_and_state(self, text):
        """Gestiona el disparo del audio y fuerza los cambios de estados síncronos en la UI."""
        if self.credits_exhausted:
            self._execute_local_tts_fallback(text)
            return

        try:
            audio_generator = self.audio_client.text_to_speech.convert(
                text=text,
                voice_id=self.target_voice_id,
                model_id="eleven_multilingual_v2"
            )
            audio_bytes = b"".join(audio_generator)
            
            buffer_path = "jarvis_voice_buffer.mp3"
            with open(buffer_path, "wb") as f:
                f.write(audio_bytes)

            self.current_state = "SPEAKING"
            asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)
            
            def play_audio_headless():
                if os.name == 'nt':
                    os.system(f"start /min powershell -c (New-Object Media.SoundPlayer '{buffer_path}').PlaySync();")
                else:
                    os.system(f"mpg123 -q {buffer_path} > /dev/null 2>&1")
                
                self.current_state = "IDLE"
                asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)
                try: os.remove(buffer_path)
                except: pass

            threading.Thread(target=play_audio_headless, daemon=True).start()

        except Exception as e:
            print(f"\n[ELEVENLABS CAP OVERRIDE]: Moviendo a síntesis local. Motivo: {e}")
            self.credits_exhausted = True
            self._execute_local_tts_fallback(text)

    def _execute_local_tts_fallback(self, text):
        """Lanza hilos de síntesis nativa por software cuando fallan los servicios en la nube."""
        def tts_worker():
            try:
                import pyttsx3
                self.current_state = "SPEAKING"
                asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)
                
                engine = pyttsx3.init()
                engine.setProperty('rate', 165)
                engine.say(text)
                engine.runAndWait()
            except Exception as tts_err:
                print(f"[OFFLINE TTS FAULT]: {tts_err}")
            finally:
                self.current_state = "IDLE"
                asyncio.run_coroutine_threadsafe(self.push_system_update(), self.main_loop)

        threading.Thread(target=tts_worker, daemon=True).start()