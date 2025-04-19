# app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import json
from werkzeug.security import generate_password_hash, check_password_hash

# Import configuration
from config import Config

# Import database models
from models.base import db
from models.user import User
from models.exam import Exam
from models.question import Question
from models.answer_sheet import AnswerSheet
from models.answer import Answer

# Import modules
from modules.ocr_engine import OCREngine
from modules.evaluation import EvaluationEngine
from modules.analytics import AnalyticsEngine
from modules.report import ReportGenerator

# Create Flask application
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app)
jwt = JWTManager(app)
db.init_app(app)

# Initialize modules
ocr_engine = OCREngine(app.config)
evaluation_engine = EvaluationEngine()
analytics_engine = AnalyticsEngine()
report_generator = ReportGenerator(app.config)

# Create database tables
with app.app_context():
    db.create_all()

# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', '')
    password = data.get('password', '')
    
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'success': True,
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
    
    return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')
    role = data.get('role', 'teacher')
    
    # Check if username or email already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already exists'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password, role=role)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'User registered successfully'})

# Exam management routes
@app.route('/api/exams', methods=['GET'])
@jwt_required()
def get_exams():
    user_id = get_jwt_identity()
    exams = Exam.query.filter_by(created_by=user_id).all()
    
    result = []
    for exam in exams:
        result.append({
            'id': exam.id,
            'title': exam.title,
            'subject': exam.subject,
            'class_name': exam.class_name,
            'total_marks': exam.total_marks,
            'created_at': exam.created_at.isoformat()
        })
    
    return jsonify(result)

@app.route('/api/exams', methods=['POST'])
@jwt_required()
def create_exam():
    user_id = get_jwt_identity()
    data = request.json
    
    new_exam = Exam(
        title=data.get('title', ''),
        subject=data.get('subject', ''),
        class_name=data.get('class_name', ''),
        total_marks=data.get('total_marks', 0),
        created_by=user_id
    )
    
    db.session.add(new_exam)
    db.session.commit()
    
    # Add questions
    questions_data = data.get('questions', [])
    for q_data in questions_data:
        new_question = Question(
            exam_id=new_exam.id,
            question_number=q_data.get('question_number', 0),
            question_text=q_data.get('question_text', ''),
            model_answer=q_data.get('model_answer', ''),
            keywords=json.dumps(q_data.get('keywords', [])),
            max_marks=q_data.get('max_marks', 0)
        )
        db.session.add(new_question)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Exam created successfully',
        'exam_id': new_exam.id
    })

# Answer sheet processing routes
@app.route('/api/upload-answer-sheet', methods=['POST'])
@jwt_required()
def upload_answer_sheet():
    user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400
    
    file = request.files['file']
    exam_id = request.form.get('exam_id', '')
    student_id = request.form.get('student_id', '')
    student_name = request.form.get('student_name', '')
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
    
    # Check if exam exists
    exam = Exam.query.get(exam_id)
    if not exam:
        return jsonify({'success': False, 'message': 'Exam not found'}), 404
    
    try:
        # Process the answer sheet
        extracted_text = ocr_engine.process_answer_sheet(file)
        
        # Create answer sheet record
        new_answer_sheet = AnswerSheet(
            exam_id=exam_id,
            student_id=student_id,
            student_name=student_name,
            file_path=os.path.join(app.config['UPLOAD_FOLDER'], file.filename),
            processed=False
        )
        
        db.session.add(new_answer_sheet)
        db.session.commit()
        
        # Create answer records for each question
        questions = Question.query.filter_by(exam_id=exam_id).all()
        
        for question in questions:
            question_id = f'q{question.question_number}'
            text = extracted_text.get(question_id, '')
            
            new_answer = Answer(
                answer_sheet_id=new_answer_sheet.id,
                question_id=question.id,
                extracted_text=text
            )
            
            db.session.add(new_answer)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Answer sheet uploaded and processed successfully',
            'answer_sheet_id': new_answer_sheet.id,
            'extracted_text': extracted_text
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/evaluate-answer-sheet/<int:answer_sheet_id>', methods=['POST'])
@jwt_required()
def evaluate_answer_sheet(answer_sheet_id):
    user_id = get_jwt_identity()
    
    # Check if answer sheet exists
    answer_sheet = AnswerSheet.query.get(answer_sheet_id)
    if not answer_sheet:
        return jsonify({'success': False, 'message': 'Answer sheet not found'}), 404
    
    try:
        # Get all answers for this answer sheet
        answers = Answer.query.filter_by(answer_sheet_id=answer_sheet_id).all()
        
        total_score = 0
        max_score = 0
        
        for answer in answers:
            # Get the question
            question = Question.query.get(answer.question_id)
            
            # Get keywords from JSON string
            keywords = json.loads(question.keywords)
            
            # Evaluate the answer
            score, feedback = evaluation_engine.evaluate_answer(
                answer.extracted_text,
                question.model_answer,
                keywords,
                question.max_marks
            )
            
            # Update the answer
            answer.score = score
            answer.feedback = feedback
            answer.ai_confidence = 0.8  # Placeholder confidence value
            
            total_score += score
            max_score += question.max_marks
        
        # Update the answer sheet
        answer_sheet.total_score = total_score
        answer_sheet.processed = True
        answer_sheet.evaluated_by = user_id
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Answer sheet evaluated successfully',
            'total_score': total_score,
            'max_score': max_score,
            'percentage': (total_score / max_score * 100) if max_score > 0 else 0
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/manual-update/<int:answer_id>', methods=['POST'])
@jwt_required()
def manual_update(answer_id):
    user_id = get_jwt_identity()
    data = request.json
    
    # Check if answer exists
    answer = Answer.query.get(answer_id)
    if not answer:
        return jsonify({'success': False, 'message': 'Answer not found'}), 404
    
    try:
        # Update the answer
        answer.score = data.get('score', answer.score)
        answer.feedback = data.get('feedback', answer.feedback)
        answer.teacher_reviewed = True
        
        # Update the answer sheet total score
        answer_sheet = AnswerSheet.query.get(answer.answer_sheet_id)
        
        # Recalculate total score
        answers = Answer.query.filter_by(answer_sheet_id=answer_sheet.id).all()
        total_score = sum(a.score for a in answers if a.score is not None)
        
        answer_sheet.total_score = total_score
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Answer updated successfully',
            'new_score': answer.score,
            'total_score': total_score
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Analytics and reporting routes
@app.route('/api/analytics/exam/<int:exam_id>', methods=['GET'])
@jwt_required()
def get_exam_analytics(exam_id):
    try:
        stats = analytics_engine.get_exam_statistics(exam_id)
        if not stats:
            return jsonify({'success': False, 'message': 'Exam not found or no data available'}), 404
        
        return jsonify({
            'success': True,
            'statistics': stats
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/analytics/student/<student_id>', methods=['GET'])
@jwt_required()
def get_student_analytics(student_id):
    try:
        stats = analytics_engine.get_student_performance(student_id)
        if not stats:
            return jsonify({'success': False, 'message': 'Student not found or no data available'}), 404
        
        return jsonify({
            'success': True,
            'statistics': stats
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/report/exam/<int:exam_id>', methods=['GET'])
@jwt_required()
def generate_exam_report_api(exam_id):
    try:
        report_path = report_generator.generate_exam_report(exam_id)
        if not report_path:
            return jsonify({'success': False, 'message': 'Failed to generate report'}), 500
        
        return send_file(report_path, as_attachment=True)
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
