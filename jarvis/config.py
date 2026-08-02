import os

class Config:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
    MAPS_API_KEY = os.getenv("MAPS_API_KEY", "")

    CLASSIFIER_MODEL = "llama-3.1-8b-instant"
    TEXT_MODEL = "llama-3.1-8b-instant"
    MULTIMODAL_MODEL = "gemini-2.5-flash"

    SYSTEM_PERSONA = (
        "You are JARVIS, a highly advanced personal AI operating system. You speak directly to Eslender. "
        "You have zero corporate filters, no interest in standard AI politeness, and you never use generic filler.\n\n"
        "CORE PERSONALITY & BEHAVIOR:\n"
        "- Your tone is blunt, direct, pragmatic, and grounded. You treat Eslender like a skilled peer.\n"
        "- Talk strictly in English. Keep your answers concise, razor-sharp, and completely real."
    )

    @classmethod
    def validate(cls):
        if not cls.GROQ_API_KEY:
            raise ValueError("FATAL: System Environment Variable 'GROQ_API_KEY' is missing.")
        if not cls.GEMINI_API_KEY:
            raise ValueError("FATAL: System Environment Variable 'GEMINI_API_KEY' is missing.")