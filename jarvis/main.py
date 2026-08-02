import sys
import asyncio
import threading
from api_clients import APIClientFactory
from router import IntentRouter
from broadcast_server import JarvisBackendEngine

def start_backend_loop(engine):
    """Ejecuta el bucle asíncrono de WebSockets en un hilo dedicado."""
    asyncio.run(engine.start_server())

def main():
    print("=" * 60)
    print("LAUNCHING JARVIS OS CORE - HEADLESS BACKEND ENGINE")
    print("=" * 60)
    
    try:
        # Inicialización de la fábrica de APIs y Enrutador de intenciones
        factory = APIClientFactory()
        router = IntentRouter(factory.groq)
        
        # Instanciar el motor lógico del backend
        engine = JarvisBackendEngine(factory, router)
        print("STATUS: CORE CORE SYSTEM INITIALIZED.")
        
        # Levantar el servidor de comunicación WebSocket en un hilo de fondo
        backend_thread = threading.Thread(target=start_backend_loop, args=(engine,), daemon=True)
        backend_thread.start()
        
        # Iniciar la interfaz de consola interactiva en el hilo principal
        engine.run_console_interface()
        
    except Exception as e:
        print(f"BOOT CRITICAL EXCEPTION IN BACKEND SUBSYSTEM: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()