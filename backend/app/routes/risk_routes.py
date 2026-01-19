from flask import Blueprint, jsonify, request
from ..services.risk_manager import RiskManager
from ..models import User, db

risk_bp = Blueprint('risk', __name__)

@risk_bp.route('/metrics', methods=['GET'])
def get_risk_metrics():
    """Get current risk metrics for a user"""
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email required"}), 400
    
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    metrics = RiskManager.get_risk_metrics(user.id)
    if not metrics:
        return jsonify({"message": "Unable to calculate metrics"}), 500
    
    return jsonify(metrics)

@risk_bp.route('/check', methods=['GET'])
def check_risk():
    """Check if user has violated risk rules"""
    email = request.args.get('email')
    if not email:
        return jsonify({"message": "Email required"}), 400
    
    user = User.query.filter_by(username=email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    risk_check = RiskManager.check_risk_rules(user.id)
    return jsonify(risk_check)
