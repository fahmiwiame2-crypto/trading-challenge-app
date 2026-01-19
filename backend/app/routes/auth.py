from flask import Blueprint, jsonify, request
from ..models import User, db, UserChallenge

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password') # In real app, check hash

    user = User.query.filter_by(username=email).first()
    
    if user:
        # NO automatic challenge creation - users must pay first
        
        # Check for active challenge
        active_challenge = UserChallenge.query.filter_by(
            user_id=user.id, 
            challenge_status='active'
        ).first()

        return jsonify({
            "token": "mock-jwt-token-123",
            "user": {
                "id": user.id,
                "email": user.username,
                "name": user.username.split('@')[0],
                "status": user.status,
                "has_active_challenge": bool(active_challenge),
                "active_challenge_id": active_challenge.id if active_challenge else None
            }
        })
    return jsonify({"message": "Invalid credentials"}), 401
@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current user details including status and active challenge"""
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email required"}), 400
        
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    # Check for active challenge
    active_challenge = UserChallenge.query.filter_by(
        user_id=user.id, 
        challenge_status='active'
    ).first()
    
    return jsonify({
        "user": {
            "id": user.id,
            "email": user.username,
            "name": user.username.split('@')[0],
            "status": user.status,
            "has_active_challenge": bool(active_challenge),
            "active_challenge_id": active_challenge.id if active_challenge else None,
            "balance": user.balance,
            "avatar_url": user.avatar_url
        }
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        username = data.get('username', email.split('@')[0] if email else 'user')
        password = data.get('password')  # In production, hash this!
        
        if not email:
            return jsonify({"message": "Email requis"}), 400

        if User.query.filter_by(username=email).first():
            return jsonify({"message": "Cet email est déjà utilisé"}), 400

        # Create user WITHOUT challenge - must pay to get a challenge
        from datetime import datetime
        
        new_user = User(
            username=email,
            balance=0,  # No balance until they pay
            status='PENDING',  # Pending until they purchase a challenge
            initial_capital=0,
            daily_starting_equity=0,
            last_equity_reset=datetime.utcnow(),
            failure_reason=None,
            avatar_url=None
        )
        db.session.add(new_user)
        db.session.commit()

        print(f"User registered: {email} - No challenge (must pay first)")
        return jsonify({
            "message": "Compte créé avec succès!",
            "token": "mock-jwt-token-123",
            "user": {
                "id": new_user.id,
                "email": new_user.username,
                "name": username,
                "status": new_user.status,
                "has_active_challenge": False,
                "active_challenge_id": None
            }
        })
    except Exception as e:
        db.session.rollback()
        error_msg = f"Registration error: {e}"
        print(error_msg)
        with open("error_log.txt", "a", encoding="utf-8") as f:
            f.write(f"{datetime.now()}: {error_msg}\n")
            import traceback
            f.write(traceback.format_exc())
            f.write("-" * 20 + "\n")
        return jsonify({"message": f"Erreur: {str(e)}"}), 500

@auth_bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"message": "Email required"}), 400

    user = User.query.filter_by(username=email).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        # Import all models with user_id foreign keys
        from ..models import (
            Trade, UserChallenge, Payment, UserProgress, 
            UserLessonProgress, Certificate, QuizAnswer, 
            ChatMessage, RiskAlert, UserBadge, UserXP, 
            MessageReaction, Account, Transaction, Leaderboard
        )
        
        # Delete all related records first (cascade delete)
        Trade.query.filter_by(user_id=user.id).delete()
        Payment.query.filter_by(user_id=user.id).delete()
        UserChallenge.query.filter_by(user_id=user.id).delete()
        UserProgress.query.filter_by(user_id=user.id).delete()
        UserLessonProgress.query.filter_by(user_id=user.id).delete()
        Certificate.query.filter_by(user_id=user.id).delete()
        QuizAnswer.query.filter_by(user_id=user.id).delete()
        ChatMessage.query.filter_by(user_id=user.id).delete()
        RiskAlert.query.filter_by(user_id=user.id).delete()
        UserBadge.query.filter_by(user_id=user.id).delete()
        UserXP.query.filter_by(user_id=user.id).delete()
        MessageReaction.query.filter_by(user_id=user.id).delete()
        Account.query.filter_by(user_id=user.id).delete()
        Transaction.query.filter_by(user_id=user.id).delete()
        Leaderboard.query.filter_by(user_id=user.id).delete()
        
        # Now delete the user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        db.session.rollback()
        print(f"Delete account error: {e}")
        return jsonify({"message": f"Error deleting account: {str(e)}"}), 500


import os
from werkzeug.utils import secure_filename
from flask import current_app, url_for

@auth_bp.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    print("DEBUG: Upload avatar request received", flush=True)
    if 'avatar' not in request.files:
        print("DEBUG: No 'avatar' file in request.files", flush=True)
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['avatar']
    email = request.form.get('email')
    
    print(f"DEBUG: File: {file.filename if file else 'None'}, Email: {email}", flush=True)
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and email:
        try:
            filename = secure_filename(f"avatar_{email}_{file.filename}")
            
            # Ensure directory exists
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads', 'avatars')
            os.makedirs(upload_folder, exist_ok=True)
            
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            print(f"DEBUG: File saved to {file_path}", flush=True)
            
            # Update user
            user = User.query.filter_by(username=email).first()
            if user:
                # Generate full URL for the frontend
                # 'static' endpoint maps to the static folder
                relative_path = f"uploads/avatars/{filename}"
                user.avatar_url = url_for('static', filename=relative_path, _external=True)
                db.session.commit()
                print(f"DEBUG: User updated with URL {user.avatar_url}", flush=True)
                
                return jsonify({
                    'message': 'Avatar uploaded successfully',
                    'avatar_url': user.avatar_url
                })
            else:
                print(f"DEBUG: User {email} not found", flush=True)
                return jsonify({'error': 'User not found'}), 404
        except Exception as e:
            print(f"DEBUG: Exception during upload: {e}", flush=True)
            return jsonify({'error': str(e)}), 500
            
    return jsonify({'error': 'Upload failed'}), 500
