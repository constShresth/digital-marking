# models/answer_sheet.py
from .base import db, datetime
import json

class AnswerSheet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exam.id'), nullable=False)
    student_id = db.Column(db.String(50), nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    processed = db.Column(db.Boolean, default=False)
    total_score = db.Column(db.Float, nullable=True)
    evaluated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    answers = db.relationship('Answer', backref='answer_sheet', lazy=True)
    
    def __repr__(self):
        return f'<AnswerSheet {self.id} for Student {self.student_id}>'
