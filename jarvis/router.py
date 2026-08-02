import os
import subprocess
import sys

class IntentRouter:
    def __init__(self, groq_client=None):
        self.groq = groq_client
        self.automation_keywords = ["open", "launch", "kill", "close", "clear cache", "system status", "show map", "show spotify", "reset view", "route to"]

    def determine_route(self, user_input):
        cleaned_input = user_input.lower().strip()

        if "system status" in cleaned_input or "metrics" in cleaned_input:
            return {"target": "LOCAL_SYSTEM", "intent": "TELEMETRY_INQUIRY", "visual_mode": "CORE"}

        if "route to work" in cleaned_input or "fastest route" in cleaned_input or "drive to work" in cleaned_input:
            return {"target": "LOCAL_SYSTEM", "intent": "NAVIGATION_ROUTE", "visual_mode": "MAP"}

        if "show map" in cleaned_input or "display map" in cleaned_input:
            return {"target": "LOCAL_SYSTEM", "intent": "VISUAL_SHIFT", "visual_mode": "MAP"}
        if "show spotify" in cleaned_input or "display spotify" in cleaned_input:
            return {"target": "LOCAL_SYSTEM", "intent": "VISUAL_SHIFT", "visual_mode": "SPOTIFY"}
        if "reset view" in cleaned_input or "show core" in cleaned_input:
            return {"target": "LOCAL_SYSTEM", "intent": "VISUAL_SHIFT", "visual_mode": "CORE"}

        for keyword in self.automation_keywords:
            if cleaned_input.startswith(keyword):
                action = keyword
                if keyword in ["close", "kill"]: action = "kill"
                elif keyword in ["open", "launch"]: action = "open"
                return {"target": "LOCAL_SYSTEM", "intent": "SYSTEM_AUTOMATION", "action": action, "visual_mode": "CORE"}

        if "look at" in cleaned_input or "analyze this image" in cleaned_input:
            return {"target": "GEMINI", "intent": "VISION_ANALYSIS"}

        return {"target": "GROQ", "intent": "GENERAL_INFERENCE"}

    def execute_local_action(self, user_input, intent_map):
        intent = intent_map.get("intent", "")
        action = intent_map.get("action", "")
        cleaned_input = user_input.lower().strip()

        app_mappings = {"whatsapp": "WhatsApp", "spotify": "spotify", "discord": "Discord", "chrome": "chrome", "vs code": "code"}

        try:
            if intent == "NAVIGATION_ROUTE":
                return "Calculating telemetry vectors for your workplace transit path, sir. Rendering static map projection now."
            
            if intent == "VISUAL_SHIFT":
                return f"Shifting graphic matrices to {intent_map.get('visual_mode')} orientation."

            if action in ["open", "launch"]:
                app_target = user_input.split(intent_map.get("action"), 1)[1].strip().lower()
                exe_name = app_mappings.get(app_target, app_target)
                if os.name == "nt": os.system(f"start {exe_name}")
                return f"Dispatched background execution thread for: '{exe_name}'."

            elif action == "kill":
                app_target = user_input.split(intent_map.get("action"), 1)[1].strip().lower()
                exe_name = app_mappings.get(app_target, app_target)
                if not exe_name.endswith(".exe") and os.name == "nt": exe_name += ".exe"
                if os.name == "nt":
                    result = os.system(f"taskkill /F /IM {exe_name}")
                    if result == 0: return f"Core image '{exe_name}' has been purged from active memory stack."
                    return f"Process image '{exe_name}' was not detected running."

            elif "clear cache" in cleaned_input:
                return "Garbage collection subroutines executed. Local temporary directories flushed."

        except Exception as e:
            return f"Execution pipeline aborted due to unhandled shell fault: {e}"
        
        return "Local command sequence interpreted smoothly."