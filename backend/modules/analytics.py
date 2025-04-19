# modules/analytics.py
import pandas as pd
import numpy as np
import json
from sqlalchemy import func
from models.base import db
from models.answer_sheet import AnswerSheet
from models.answer import Answer
from models.question import Question
from models.exam import Exam

class AnalyticsEngine:
    def __init__(self):
        pass
    
    def get_exam_statistics(self, exam_id):
        """Get statistics for a specific exam"""
        # Get basic exam info
        exam = Exam.query.get(exam_id)
        if not exam:
            return None
        
        # Get all answer sheets for this exam
        answer_sheets = AnswerSheet.query.filter_by(exam_id=exam_id).all()
        
        # Calculate statistics
        total_students = len(answer_sheets)
        completed_evaluations = sum(1 for sheet in answer_sheets if sheet.processed)
        
        # Calculate score statistics
        scores = [sheet.total_score for sheet in answer_sheets if sheet.total_score is not None]
        
        if scores:
            avg_score = sum(scores) / len(scores)
            max_score = max(scores)
            min_score = min(scores)
            
            # Calculate score distribution
            bins = [0, 35, 50, 60, 75, 90, 100]
            hist, _ = np.histogram([s * 100 / exam.total_marks for s in scores], bins=bins)
            score_distribution = {
                'ranges': ['0-35%', '35-50%', '50-60%', '60-75%', '75-90%', '90-100%'],
                'counts': hist.tolist()
            }
        else:
            avg_score = 0
            max_score = 0
            min_score = 0
            score_distribution = {
                'ranges': ['0-35%', '35-50%', '50-60%', '60-75%', '75-90%', '90-100%'],
                'counts': [0, 0, 0, 0, 0, 0]
            }
        
        # Get question-wise statistics
        questions = Question.query.filter_by(exam_id=exam_id).all()
        question_stats = []
        
        for question in questions:
            # Get all answers for this question
            answers = Answer.query.join(AnswerSheet).filter(
                AnswerSheet.exam_id == exam_id,
                Answer.question_id == question.id
            ).all()
            
            if answers:
                q_scores = [a.score for a in answers if a.score is not None]
                avg_q_score = sum(q_scores) / len(q_scores) if q_scores else 0
                max_q_score = max(q_scores) if q_scores else 0
                min_q_score = min(q_scores) if q_scores else 0
                
                # Calculate percentage of max score
                avg_percentage = (avg_q_score / question.max_marks) * 100 if question.max_marks > 0 else 0
            else:
                avg_q_score = 0
                max_q_score = 0
                min_q_score = 0
                avg_percentage = 0
            
            question_stats.append({
                'question_number': question.question_number,
                'max_marks': question.max_marks,
                'avg_score': round(avg_q_score, 2),
                'max_score': max_q_score,
                'min_score': min_q_score,
                'avg_percentage': round(avg_percentage, 2)
            })
        
        return {
            'exam_id': exam_id,
            'exam_title': exam.title,
            'subject': exam.subject,
            'class_name': exam.class_name,
            'total_marks': exam.total_marks,
            'total_students': total_students,
            'completed_evaluations': completed_evaluations,
            'avg_score': round(avg_score, 2),
            'max_score': max_score,
            'min_score': min_score,
            'score_distribution': score_distribution,
            'question_stats': question_stats
        }
    
    def get_student_performance(self, student_id):
        """Get performance statistics for a specific student"""
        # Get all answer sheets for this student
        answer_sheets = AnswerSheet.query.filter_by(student_id=student_id).all()
        
        if not answer_sheets:
            return None
        
        # Get student name from first answer sheet
        student_name = answer_sheets[0].student_name
        
        # Prepare exam results
        exam_results = []
        
        for sheet in answer_sheets:
            exam = Exam.query.get(sheet.exam_id)
            
            if sheet.processed and sheet.total_score is not None:
                percentage = (sheet.total_score / exam.total_marks) * 100
            else:
                percentage = 0
            
            # Get question-wise results
            question_results = []
            answers = Answer.query.filter_by(answer_sheet_id=sheet.id).all()
            
            for answer in answers:
                question = Question.query.get(answer.question_id)
                
                if answer.score is not None:
                    q_percentage = (answer.score / question.max_marks) * 100 if question.max_marks > 0 else 0
                else:
                    q_percentage = 0
                
                question_results.append({
                    'question_number': question.question_number,
                    'max_marks': question.max_marks,
                    'score': answer.score,
                    'percentage': round(q_percentage, 2),
                    'feedback': answer.feedback
                })
            
            exam_results.append({
                'exam_id': exam.id,
                'exam_title': exam.title,
                'subject': exam.subject,
                'date': sheet.created_at.strftime('%Y-%m-%d'),
                'total_marks': exam.total_marks,
                'score': sheet.total_score,
                'percentage': round(percentage, 2),
                'processed': sheet.processed,
                'question_results': question_results
            })
        
        return {
            'student_id': student_id,
            'student_name': student_name,
            'exam_count': len(exam_results),
            'exam_results': exam_results
        }
