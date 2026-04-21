import os
from openai import AsyncOpenAI
from typing import List, Dict, Optional
import json
from dotenv import load_dotenv

load_dotenv()

# Setup OpenAI
API_KEY = os.getenv("OPENAI_API_KEY")
if API_KEY:
    client = AsyncOpenAI(api_key=API_KEY)
else:
    client = None


class AIService:
    @staticmethod
    async def analyze_fraud(activity_logs: List[Dict]) -> Dict:
        """
        Suspicious Behavior Engine powered by OpenAI GPT-4o-mini.
        Analyzes a sequence of logs to detect complex fraud patterns.
        """
        if not client:
            return {"status": "error", "message": "AI Engine not configured"}

        prompt = f"""
        Analyze the following user activity logs for potential fraud or suspicious behavior in a business directory platform.
        Look for:
        1. Rapid multiple account creations.
        2. Suspicious IP switching.
        3. Attempts to brute force or bypass security.
        4. Unusual business data patterns (gibberish names, suspicious phones).

        Logs: {json.dumps(activity_logs)}

        Return ONLY a JSON object with this structure:
        {{
            "risk_score": 0-100,
            "flags": ["list of strings"],
            "recommendation": "allow" | "flag" | "block",
            "analysis": "one sentence summary"
        }}
        """
        
        try:
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional security analyst specializing in fraud detection for digital marketplaces."},
                    {"role": "user", "content": prompt}
                ],
                response_format={ "type": "json_object" }
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"status": "error", "error": str(e)}

    @staticmethod
    async def business_assistant(query: str, business_context: Optional[Dict] = None) -> str:
        """
        AI Business Assistant to help owners optimize their listings using GPT-4o-mini.
        """
        if not client:
            return "LocalLink AI is currently offline. Please set OPENAI_API_KEY."

        context_str = f"Context: {json.dumps(business_context)}" if business_context else ""
        prompt = f"""
        You are the LocalLink AI Assistant. Your goal is to help local businesses in Kosovo succeed.
        {context_str}
        
        User Query: {query}
        
        Provide professional, helpful, and concise advice in the language of the query (Albanian or English).
        """

        try:
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful business growth assistant specializing in the Balkan market, specifically Kosovo."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"


# Singleton instance
ai_service = AIService()
