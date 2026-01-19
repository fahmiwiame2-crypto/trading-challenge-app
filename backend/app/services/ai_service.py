import random
import os
from app.services.bvc_service import BVCService
from app.services.news_service import NewsService

# Import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Import Groq (alternative gratuite)
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

class AIService:
    
    @staticmethod
    def _get_gemini_key():
        """Get Gemini API key dynamically"""
        return os.getenv('GEMINI_API_KEY', '')
    
    @staticmethod
    def _get_groq_key():
        """Get Groq API key dynamically"""
        return os.getenv('GROQ_API_KEY', '')
    
    @staticmethod
    def _configure_gemini():
        """Configure Gemini API if available"""
        api_key = AIService._get_gemini_key()
        if GEMINI_AVAILABLE and api_key:
            try:
                genai.configure(api_key=api_key)
                return True
            except Exception as e:
                print(f"Error configuring Gemini: {e}")
                return False
        return False
    
    @staticmethod
    def get_gemini_response(message, market_context=""):
        """
        Get response from Google Gemini AI with market context
        """
        if not AIService._configure_gemini():
            return None
            
        try:
            # Create the model - using gemini-2.0-flash (fast and available)
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Build the prompt with context
            system_prompt = """Tu es TradeSense Copilot, un assistant IA expert en trading et marchés financiers.
Tu es spécialisé dans le marché boursier marocain (BVC - Bourse de Casablanca) et les crypto-monnaies.
Tu dois répondre de manière professionnelle, précise et utile.
Utilise les données du marché fournies pour donner des réponses contextualisées.
Si on te pose une question générale, réponds normalement.
Réponds toujours en français."""

            if market_context:
                full_prompt = f"{system_prompt}\n\nDonnées du marché BVC actuelles:\n{market_context}\n\nQuestion de l'utilisateur: {message}"
            else:
                full_prompt = f"{system_prompt}\n\nQuestion de l'utilisateur: {message}"
            
            # Generate response
            response = model.generate_content(full_prompt)
            
            if response and response.text:
                return response.text
            return None
            
        except Exception as e:
            print(f"Error getting Gemini response: {e}")
            return None
    
    @staticmethod
    def get_groq_response(message, market_context=""):
        """
        Get response from Groq API (free Llama model) with market context
        """
        api_key = AIService._get_groq_key()
        if not GROQ_AVAILABLE or not api_key:
            return None
            
        try:
            client = Groq(api_key=api_key)
            
            # Build the system prompt
            system_prompt = """Tu es TradeSense Copilot, un assistant IA expert en trading et marchés financiers.
Tu es spécialisé dans le marché boursier marocain (BVC - Bourse de Casablanca) et les crypto-monnaies.
Tu dois répondre de manière professionnelle, précise et utile.
Utilise les données du marché fournies pour donner des réponses contextualisées.
Si on te pose une question générale (maths, histoire, science, etc.), réponds normalement.
Réponds toujours en français."""

            # Build user message with context
            if market_context:
                user_message = f"Données du marché BVC actuelles:\n{market_context}\n\nQuestion de l'utilisateur: {message}"
            else:
                user_message = message
            
            # Call Groq API with Llama 3 8B (fast and free)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Free model
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=1024
            )
            
            if response and response.choices:
                return response.choices[0].message.content
            return None
            
        except Exception as e:
            print(f"Error getting Groq response: {e}")
            return None
    
    @staticmethod
    def get_response(message):
        message_lower = message.lower()
        
        # Get market data context
        market_context = ""
        bvc_data = []
        
        try:
            bvc_data = BVCService.get_market_data()
            # Build market context string
            market_context = "📊 Données BVC en temps réel:\n"
            for stock in bvc_data[:5]:  # Top 5 stocks
                market_context += f"- {stock['symbol']} ({stock['name']}): {stock['price']} MAD, {stock['change']:+.2f}%, Volume: {stock.get('volume', 'N/A')}\n"
        except Exception as e:
            print(f"Error fetching BVC data: {e}")
            bvc_data = []
        
        # Try Gemini AI first
        print("[DEBUG] Trying Gemini API...")
        gemini_response = AIService.get_gemini_response(message, market_context)
        if gemini_response:
            print("[DEBUG] Gemini response received")
            return gemini_response
        print("[DEBUG] Gemini failed or unavailable")
        
        # Try Groq API as fallback
        print("[DEBUG] Trying Groq API...")
        groq_response = AIService.get_groq_response(message, market_context)
        if groq_response:
            print("[DEBUG] Groq response received")
            return groq_response
        print("[DEBUG] Groq failed or unavailable")
        
        # Fallback to rule-based responses if both AI fail
        print("[DEBUG] AI APIs unavailable, using fallback responses")
        
        
        # Intents
        if "bonjour" in message_lower or "salut" in message_lower or "hello" in message_lower:
            return "Bonjour ! Je suis votre assistant TradeSense Copilot. Je peux analyser le marché BVC et Crypto pour vous. Que souhaitez-vous savoir ?"
            
        if "tendance" in message_lower or "marché" in message_lower or "market" in message_lower:
            if bvc_data:
                positive_count = sum(1 for stock in bvc_data if stock['change'] > 0)
                total = len(bvc_data)
                sentiment = "haussier" if positive_count > total / 2 else "baissier"
                iam_price = next((s['price'] for s in bvc_data if s['symbol'] == 'IAM'), 'N/A')
                return f"Le marché BVC semble globalement {sentiment} aujourd'hui. {positive_count} actions sont en hausse sur {total} surveillées. L'action IAM est actuellement à {iam_price} MAD."
            return "Je ne peux pas accéder aux données du marché pour le moment."

        if "iam" in message_lower or "maroc telecom" in message_lower:
            stock = next((s for s in bvc_data if s['symbol'] == 'IAM'), None)
            if stock:
                trend = "hausse" if stock['change'] > 0 else "baisse"
                return f"Maroc Telecom (IAM) est coté à {stock['price']} MAD, en {trend} de {stock['change']}%. Volume: {stock.get('volume', 'N/A')}."
            return "Je ne trouve pas de données pour IAM pour le moment."
            
        if "atw" in message_lower or "attijari" in message_lower:
            stock = next((s for s in bvc_data if s['symbol'] == 'ATW'), None)
            if stock:
                return f"Attijariwafa Bank (ATW) s'échange à {stock['price']} MAD ({stock['change']}%). C'est une valeur clé du MASI."
            return "Je ne trouve pas de données pour ATW pour le moment."
            
        if "crypto" in message_lower or "btc" in message_lower or "bitcoin" in message_lower:
            return "Le marché crypto est très volatil. Le Bitcoin (BTC) se négocie actuellement autour de 97 000$. Je vous conseille de surveiller les niveaux de support clés et de toujours utiliser un Stop Loss."

        if "conseil" in message_lower or "buy" in message_lower or "sell" in message_lower or "achat" in message_lower:
            return "En tant qu'IA, je ne donne pas de conseils financiers directs. Cependant, observez le RSI et les volumes. Si le RSI > 70, attention au surachat. Gérez toujours votre risque avec un Stop Loss."
        
        # News & Market Summary
        if "nouvelles" in message_lower or "news" in message_lower or "actualité" in message_lower or "infos" in message_lower:
            news = NewsService.get_market_news()[:3] # Get top 3 news
            response = "📰 **Dernières Actualités du Marché :**\n\n"
            for item in news:
                sentiment_emoji = "🟢" if item['sentiment'] == 'POSITIVE' else "🔴" if item['sentiment'] == 'NEGATIVE' else "⚪"
                response += f"{sentiment_emoji} **{item['source']}**: {item['title']} ({item['time']})\n"
            return response
            
        if "résumé" in message_lower or "briefing" in message_lower or "récap" in message_lower:
            summary = NewsService.generate_ai_summary()
            response = f"📑 **{summary['title']}**\n\n"
            for line in summary['content']:
                response += f"• {line}\n"
            response += f"\n🏆 Tendance Dominante: {summary['dominant_trend']}"
            return response

        # Price queries for BVC
        if "prix" in message_lower or "cours" in message_lower or "cotation" in message_lower or "bvc" in message_lower:
            if bvc_data:
                top_stocks = bvc_data[:5]
                response = "📊 Prix BVC en temps réel :\n\n"
                for stock in top_stocks:
                    trend_emoji = "📈" if stock['change'] > 0 else "📉"
                    response += f"{trend_emoji} {stock['symbol']} : {stock['price']} MAD ({stock['change']:+.2f}%)\n"
                response += "\nVoulez-vous des détails sur une action spécifique ?"
                return response
            return "Je ne peux pas accéder aux données du marché BVC pour le moment."

        # Fallback
        return "Je comprends votre question. Je travaille en mode limité pour le moment.\n\nJe peux vous aider avec :\n1. 📊 Les prix BVC (ex: 'Prix IAM')\n2. 📰 Les dernières nouvelles (ex: 'Donne moi les nouvelles')\n3. 📑 Un briefing de marché (ex: 'Résumé marché')"

    @staticmethod
    def generate_signal(symbol):
        """
        Generates a mock trading signal for a given symbol.
        In a real app, this would use technical indicators (RSI, MACD, etc.).
        """
        # Simulated analysis
        signals = ['BUY', 'SELL', 'HOLD']
        signal_type = random.choice(signals)
        
        # Real-world mock prices for supported assets
        mock_prices = {
            # Crypto
            'BTC': 97500.0, 'BTC-USD': 97500.0,
            'ETH': 2850.0, 'ETH-USD': 2850.0,
            'SOL': 145.0, 'SOL-USD': 145.0,
            'BNB': 600.0, 'BNB-USD': 600.0,
            'XRP': 0.65, 'XRP-USD': 0.65,
            
            # Forex
            'EURUSD': 1.0850, 'EURUSD=X': 1.0850,
            'USDJPY': 150.20, 'USDJPY=X': 150.20,
            'GBPUSD': 1.2700, 'GBPUSD=X': 1.2700,
            'XAUUSD': 2050.0, 'GC=F': 2050.0,
            
            # US Stocks
            'AAPL': 175.50,
            'TSLA': 198.00,
            'NVDA': 890.00,
            'MSFT': 415.00,
            'AMZN': 178.00,
            'GOOGL': 142.00,
            'META': 485.00,
            'NFLX': 605.00
        }

        # Default to 100.0 if not found
        base_price = mock_prices.get(symbol, 100.0) 
        
        # Try to get real price if it's a BVC stock (overrides mock)
        try:
            bvc_data = BVCService.get_market_data()
            stock = next((s for s in bvc_data if s['symbol'] == symbol), None)
            if stock:
                base_price = stock['price']
        except Exception as e:
            print(f"Error getting BVC data for signal: {e}")
            
        # Add small random variation to simulate live market (0.1% to 0.5%)
        variation = random.uniform(0.995, 1.005)
        current_price = round(base_price * variation, 4 if base_price < 50 else 2)
        
        entry_price = current_price
        
        if signal_type == 'BUY':
            stop_loss = round(base_price * 0.95, 2)
            take_profit = round(base_price * 1.10, 2)
            reason = "RSI en zone de survente + Divergence haussière MACD detected."
        elif signal_type == 'SELL':
            stop_loss = round(base_price * 1.05, 2)
            take_profit = round(base_price * 0.90, 2)
            reason = "Cassure du support clé + Moyenne Mobile 50 jours baissière."
        else:
            stop_loss = 0
            take_profit = 0
            reason = "Marché indécis (Range). Attendre une cassure validée."
            
        confidence = random.randint(60, 95)
        
        return {
            "symbol": symbol,
            "signal": signal_type,
            "entry_price": entry_price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "confidence": confidence,
            "reason": reason,
            "timestamp": "Maintenant"
        }
