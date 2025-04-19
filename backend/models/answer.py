
# models/answer.py
from .base import db, datetime

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    answer_sheet_id = db.Column(db.Integer, db.ForeignKey('answer_sheet.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    extracted_text = db.Column(db.Text, nullable=True)
    score = db.Column(db.Float, nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    ai_confidence = db.Column(db.Float, nullable=True)
    teacher_reviewed = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Answer for Question {self.question_id} in AnswerSheet {self.answer_sheet_id}>'
