
# models/question.py
from .base import db, datetime

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exam_id = db.Column(db.Integer, db.ForeignKey('exam.id'), nullable=False)
    question_number = db.Column(db.Integer, nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    model_answer = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.Text, nullable=False)  # Stored as JSON string
    max_marks = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f'<Question {self.question_number} for Exam {self.exam_id}>'
