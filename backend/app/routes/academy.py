from flask import Blueprint, jsonify, request
from app.models import Course, Lesson, UserProgress, Certificate, User, db
import uuid
from datetime import datetime

academy_bp = Blueprint('academy', __name__)

@academy_bp.route('/courses', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    courses_data = [{
        'id': c.id,
        'title': c.title,
        'description': c.description,
        'total_modules': c.total_modules,
        'lesson_count': len(c.lessons),  # Actual lesson count
        'duration': c.duration,
        'category': c.category,
        'difficulty_level': c.difficulty_level,
        'tags': c.tags or [],
        'thumbnail_emoji': c.thumbnail_emoji,
        'progress': 0 # Placeholder - will be calculated per user later
    } for c in courses]
    return jsonify(courses_data)

@academy_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    user_id = request.args.get('user_id')
    course = Course.query.get_or_404(course_id)
    return jsonify(course.to_dict(user_id=user_id))

@academy_bp.route('/courses/<int:course_id>/progress', methods=['POST'])
def update_progress(course_id):
    try:
        data = request.json
        user_id = data.get('user_id')
        completed = data.get('completed', False)
        progress_pct = data.get('progress', 0)
        
        if not user_id:
            return jsonify({'message': 'User ID required'}), 400
            
        progress = UserProgress.query.filter_by(user_id=user_id, course_id=course_id).first()
        
        if not progress:
            progress = UserProgress(
                user_id=user_id, 
                course_id=course_id,
                completed=completed,
                progress_percentage=progress_pct,
                last_accessed=datetime.utcnow()
            )
            if completed:
                 progress.completed_at = datetime.utcnow()
            db.session.add(progress)
        else:
            if completed:
                progress.completed = True
                progress.completed_at = datetime.utcnow()
                progress.progress_percentage = 100
            else:
                progress.progress_percentage = max(progress.progress_percentage, progress_pct)
            
            progress.last_accessed = datetime.utcnow()
            
        db.session.commit()
        return jsonify(progress.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@academy_bp.route('/courses/<int:course_id>/certificate', methods=['POST'])
def generate_certificate(course_id):
    try:
        data = request.json
        user_id = data.get('user_id')
        
        print(f"DEBUG: Generating certificate for User {user_id} Course {course_id}")
        
        if not user_id:
            return jsonify({'message': 'User ID required'}), 400
            
        # Verify User and Course exist
        user = User.query.get(user_id)
        if not user:
             return jsonify({'message': f'User {user_id} not found'}), 404
             
        course = Course.query.get(course_id)
        if not course:
             return jsonify({'message': f'Course {course_id} not found'}), 404
            
         # Check progress - STRICT CHECK NOW
        progress = UserProgress.query.filter_by(user_id=user_id, course_id=course_id).first()
        
        if not progress or not progress.completed:
            return jsonify({
                'message': 'Vous devez terminer le cours à 100% pour obtenir le certificat.',
                'code': 'COURSE_NOT_COMPLETED'
            }), 403
            
        # Check existing certificate
        cert = Certificate.query.filter_by(user_id=user_id, course_id=course_id).first()
        
        if not cert:
            # Create new
            cert_number = f"CERT-{uuid.uuid4().hex[:8].upper()}"
            cert = Certificate(
                user_id=user_id,
                course_id=course_id,
                certificate_number=cert_number,
                issued_at=datetime.utcnow()
            )
            db.session.add(cert)
            db.session.commit()
        
        return jsonify({
            'id': cert.id,
            'certificate_number': cert.certificate_number,
            'issued_at': cert.issued_at.isoformat(),
            'student_name': user.username,
            'course_title': course.title,
            'difficulty': course.difficulty_level,
            'duration': course.duration
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"ERRORE GENERATING CERTIFICATE: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f"Server Error: {str(e)}"}), 500

@academy_bp.route('/certificate/<certificate_number>', methods=['GET'])
def get_certificate(certificate_number):
    cert = Certificate.query.filter_by(certificate_number=certificate_number).first_or_404()
    user = User.query.get(cert.user_id)
    course = Course.query.get(cert.course_id)
    
    return jsonify({
        'id': cert.id,
        'certificate_number': cert.certificate_number,
        'issued_at': cert.issued_at.isoformat(),
        'student_name': user.username,
        'course_title': course.title,
        'difficulty': course.difficulty_level,
        'duration': course.duration
    })
