from flask import Blueprint, request, jsonify
from app.services.ai_service import AIService
from app.models import ChatMessage, User, db

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    user_id = data.get('user_id')  # Get user ID from request
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    try:
        response_text = AIService.get_response(message)
    except Exception as e:
        print(f"Error in AIService.get_response: {e}")
        response_text = "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants."
    
    # Save conversation to database if user is logged in
    chat_message = None
    if user_id:
        try:
            chat_message = ChatMessage(
                user_id=user_id,
                message=message,
                response=response_text
            )
            db.session.add(chat_message)
            db.session.commit()
        except Exception as e:
            print(f"Error saving chat message: {e}")
            db.session.rollback()
            chat_message = None
    
    return jsonify({
        "response": response_text,
        "timestamp": chat_message.timestamp.isoformat() if chat_message else None
    })

@ai_bp.route('/chat/history', methods=['GET'])
def get_chat_history():
    """Retrieve user's chat history"""
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID required"}), 400
    
    try:
        # Get last 50 messages for this user
        messages = ChatMessage.query.filter_by(user_id=user_id)\
            .order_by(ChatMessage.timestamp.desc())\
            .limit(50)\
            .all()
        
        # Reverse to get chronological order (oldest first)
        messages.reverse()
        
        return jsonify({
            "history": [msg.to_dict() for msg in messages],
            "count": len(messages)
        })
    except Exception as e:
        print(f"Error retrieving chat history: {e}")
        return jsonify({"error": str(e)}), 500

@ai_bp.route('/signal', methods=['POST'])
def get_signal():
    data = request.json
    symbol = data.get('symbol', 'BTC')
    
    signal_data = AIService.generate_signal(symbol)
    
    return jsonify(signal_data)
