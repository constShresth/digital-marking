# models/exam.py
from .base import db, datetime

class Exam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(50), nullable=False)
    class_name = db.Column(db.String(20), nullable=False)
    total_marks = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('Question', backref='exam', lazy=True)
    answer_sheets = db.relationship('AnswerSheet', backref='exam', lazy=True)
    
    def __repr__(self):
        return f'<Exam {self.title}>'
