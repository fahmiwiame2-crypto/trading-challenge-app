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
        print("[DEBUG] AI APIs unavailable, using intelligent fallback responses")
        
        # Enhanced fallback with risk analysis
        if "risque" in message_lower or "risk" in message_lower:
            return """📊 **Analyse des Risques de Trading**

Les principaux risques aujourd'hui sont :

1. **Risque de Marché** 📉
   - Volatilité accrue sur les indices
   - Surveillez le niveau de support clé

2. **Risque de Liquidité** 💧
   - Volume faible = spreads plus larges
   - Évitez de trader pendant les périodes creuses

3. **Risque de Sur-Trading** ⚠️
   - Ne dépassez pas 2-3% de risque par trade
   - Respectez votre plan de trading

**Conseil** : Utilisez toujours un Stop Loss et ne risquez jamais plus de 1-2% de votre capital par position."""
        
        # Intents
        if "bonjour" in message_lower or "salut" in message_lower or "hello" in message_lower:
            return "Bonjour ! Je suis votre assistant TradeSense Copilot 🤖\n\nJe peux vous aider avec :\n• Analyse du marché BVC 📊\n• Conseils de gestion des risques ⚠️\n• Dernières actualités 📰\n• Stratégies de trading 💡\n\nQue souhaitez-vous savoir ?"
            
        if "tendance" in message_lower or "marché" in message_lower or "market" in message_lower:
            if bvc_data:
                positive_count = sum(1 for stock in bvc_data if stock['change'] > 0)
                total = len(bvc_data)
                sentiment = "haussier 📈" if positive_count > total / 2 else "baissier 📉"
                iam_price = next((s['price'] for s in bvc_data if s['symbol'] == 'IAM'), 'N/A')
                return f"**Analyse de Marché BVC**\n\nLe marché semble globalement {sentiment} aujourd'hui.\n\n• {positive_count} actions en hausse sur {total} surveillées\n• IAM (Maroc Telecom) : {iam_price} MAD\n• Sentiment général : {sentiment.replace('📈', '').replace('📉', '')}\n\n💡 Surveillez les cassures de support/résistance pour vos entrées."
            return "📊 Impossible d'accéder aux données de marché actuellement. Vérifiez votre connexion."

        if "iam" in message_lower or "maroc telecom" in message_lower:
            stock = next((s for s in bvc_data if s['symbol'] == 'IAM'), None)
            if stock:
                trend = "hausse 📈" if stock['change'] > 0 else "baisse 📉"
                return f"**Maroc Telecom (IAM)**\n\n💰 Prix : {stock['price']} MAD\n📊 Variation : {stock['change']:+.2f}%\n📈 Tendance : {trend}\n📦 Volume : {stock.get('volume', 'N/A')}\n\n💡 IAM est une valeur défensive du MASI."
            return "❌ Données IAM temporairement indisponibles."
            
        if "atw" in message_lower or "attijari" in message_lower:
            stock = next((s for s in bvc_data if s['symbol'] == 'ATW'), None)
            if stock:
                return f"**Attijariwafa Bank (ATW)**\n\n💰 {stock['price']} MAD ({stock['change']:+.2f}%)\n🏦 Leader bancaire marocain\n📊 Poids important dans le MASI"
            return "❌ Données ATW temporairement indisponibles."
            
        if "crypto" in message_lower or "btc" in message_lower or "bitcoin" in message_lower:
            return """🪙 **Marché Crypto - Analyse Rapide**

• **Bitcoin (BTC)** : ~97,000 USD
• **Ethereum (ETH)** : ~2,850 USD  
• **Volatilité** : ÉLEVÉE ⚠️

**Conseils Crypto :**
1. Utilisez TOUJOURS un Stop Loss
2. Ne tradez que 1-2% de votre capital
3. Surveillez les niveaux de support : 95k$ pour BTC
4. Évitez le FOMO (Fear Of Missing Out)

💡 Le marché crypto est 24/7 - gérez votre temps et énergie !"""

        if "conseil" in message_lower or "buy" in message_lower or "sell" in message_lower or "achat" in message_lower or "stratégie" in message_lower:
            return """💡 **Conseils de Trading Professionnel**

**Règles d'Or :**
1. **Gestion du Risque** ⚠️
   - Max 1-2% du capital par trade
   - Stop Loss OBLIGATOIRE

2. **Analyse Technique** 📊
   - RSI > 70 : Surachat (prudence)
   - RSI < 30 : Survente (opportunité ?)
   - Confirmez avec les volumes

3. **Psychologie** 🧠
   - Pas de revenge trading
   - Suivez votre plan
   - Acceptez les pertes

4. **Timing** ⏰
   - Évitez les heures creuses
   - Tradez les breakouts confirmés

⚖️ Je ne donne pas de conseils financiers directs - faites vos propres recherches !"""
        
        # News & Market Summary
        if "nouvelles" in message_lower or "news" in message_lower or "actualité" in message_lower or "infos" in message_lower:
            news = NewsService.get_market_news()[:3]
            response = "📰 **Dernières Actualités du Marché**\n\n"
            for item in news:
                sentiment_emoji = "🟢" if item['sentiment'] == 'POSITIVE' else "🔴" if item['sentiment'] == 'NEGATIVE' else "⚪"
                response += f"{sentiment_emoji} **{item['source']}**\n{item['title']}\n🕐 {item['time']}\n\n"
            return response
            
        if "résumé" in message_lower or "briefing" in message_lower or "récap" in message_lower:
            summary = NewsService.generate_ai_summary()
            response = f"📑 **{summary['title']}**\n\n"
            for line in summary['content']:
                response += f"• {line}\n"
            response += f"\n\n🏆 **Tendance Dominante** : {summary['dominant_trend']}"
            return response

        # Price queries for BVC
        if "prix" in message_lower or "cours" in message_lower or "cotation" in message_lower or "bvc" in message_lower:
            if bvc_data:
                top_stocks = bvc_data[:5]
                response = "📊 **Prix BVC en Temps Réel**\n\n"
                for stock in top_stocks:
                    trend_emoji = "📈" if stock['change'] > 0 else "📉"
                    response += f"{trend_emoji} **{stock['symbol']}** : {stock['price']} MAD ({stock['change']:+.2f}%)\n"
                response += "\n💬 Demandez-moi des détails sur une action spécifique !"
                return response
            return "❌ Impossible d'accéder aux données BVC actuellement."

        # Generic helpful fallback
        return """Je suis TradeSense Copilot 🤖, votre assistant trading !

**Je peux vous aider avec :**

1. 📊 **Prix BVC** - "Prix IAM" ou "Cours ATW"
2. 📰 **Actualités** - "Donne-moi les nouvelles"  
3. 📑 **Briefing** - "Résumé marché"
4. ⚠️ **Gestion Risques** - "Quels sont les risques ?"
5. 💡 **Conseils Trading** - "Donne-moi des conseils"

Que souhaitez-vous savoir ? 😊"""

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
        
        # Risk level and quality score based on confidence
        if confidence >= 80:
            risk_level = "low"
            risk_message = "Conditions favorables. Risque modéré."
            quality_score = confidence
        elif confidence >= 65:
            risk_level = "medium"
            risk_message = "Volatilité modérée détectée. Ajustez vos stop-loss."
            quality_score = confidence - 10
        else:
            risk_level = "high"
            risk_message = "Forte volatilité ! Évitez ce trade ou réduisez votre exposition."
            quality_score = confidence - 20
        
        return {
            "symbol": symbol,
            "signal": signal_type,
            "entry_price": entry_price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "confidence": confidence,
            "reason": reason,
            "timestamp": "Maintenant",
            "risk_level": risk_level,
            "risk_message": risk_message,
            "quality_score": quality_score
        }
