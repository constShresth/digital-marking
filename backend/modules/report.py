# modules/report.py
import os
import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64
from datetime import datetime
from fpdf import FPDF
from modules.analytics import AnalyticsEngine

class ReportGenerator:
    def __init__(self, config):
        self.config = config
        self.analytics = AnalyticsEngine()
        
        # Create reports directory if it doesn't exist
        self.reports_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'reports')
        os.makedirs(self.reports_dir, exist_ok=True)
    
    def _create_score_distribution_chart(self, score_distribution):
        """Create a bar chart for score distribution"""
        plt.figure(figsize=(10, 6))
        plt.bar(score_distribution['ranges'], score_distribution['counts'])
        plt.xlabel('Score Range')
        plt.ylabel('Number of Students')
        plt.title('Score Distribution')
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        # Save chart to memory
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        
        # Convert to base64 for embedding in PDF
        image_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()
        
        return image_data
    
    def _create_question_performance_chart(self, question_stats):
        """Create a bar chart for question-wise performance"""
        question_numbers = [f"Q{q['question_number']}" for q in question_stats]
        avg_percentages = [q['avg_percentage'] for q in question_stats]
        
        plt.figure(figsize=(10, 6))
        plt.bar(question_numbers, avg_percentages)
        plt.xlabel('Question Number')
        plt.ylabel('Average Score (%)')
        plt.title('Question-wise Performance')
        plt.axhline(y=60, color='r', linestyle='-', alpha=0.3)  # Pass mark line
        plt.tight_layout()
        
        # Save chart to memory
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        
        # Convert to base64 for embedding in PDF
        image_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()
        
        return image_data
    
    def generate_exam_report(self, exam_id):
        """Generate a PDF report for an exam"""
        # Get exam statistics
        stats = self.analytics.get_exam_statistics(exam_id)
        
        if not stats:
            return None
        
        # Create charts
        score_chart = self._create_score_distribution_chart(stats['score_distribution'])
        question_chart = self._create_question_performance_chart(stats['question_stats'])
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Title
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(0, 10, f"Exam Report: {stats['exam_title']}", 0, 1, 'C')
        
        # Basic information
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 10, f"Subject: {stats['subject']}", 0, 1)
        pdf.cell(0, 10, f"Class: {stats['class_name']}", 0, 1)
        pdf.cell(0, 10, f"Total Students: {stats['total_students']}", 0, 1)
        pdf.cell(0, 10, f"Completed Evaluations: {stats['completed_evaluations']}", 0, 1)
        
        # Score statistics
        pdf.ln(5)
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, "Score Statistics", 0, 1)
        
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 10, f"Average Score: {stats['avg_score']} / {stats['total_marks']} ({round(stats['avg_score']/stats['total_marks']*100, 2)}%)", 0, 1)
        pdf.cell(0, 10, f"Highest Score: {stats['max_score']} / {stats['total_marks']} ({round(stats['max_score']/stats['total_marks']*100, 2)}%)", 0, 1)
        pdf.cell(0, 10, f"Lowest Score: {stats['min_score']} / {stats['total_marks']} ({round(stats['min_score']/stats['total_marks']*100, 2)}%)", 0, 1)
        
        # Score distribution chart
        pdf.ln(5)
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, "Score Distribution", 0, 1)
        
        # Add chart image
        pdf.image(BytesIO(base64.b64decode(score_chart)), x=10, y=None, w=180)
        
        # Question-wise statistics
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, "Question-wise Performance", 0, 1)
        
        # Add chart image
        pdf.image(BytesIO(base64.b64decode(question_chart)), x=10, y=None, w=180)
        
        # Question details table
        pdf.ln(5)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(20, 10, "Q.No.", 1, 0, 'C')
        pdf.cell(30, 10, "Max Marks", 1, 0, 'C')
        pdf.cell(30, 10, "Avg Score", 1, 0, 'C')
        pdf.cell(30, 10, "Max Score", 1, 0, 'C')
        pdf.cell(30, 10, "Min Score", 1, 0, 'C')
        pdf.cell(40, 10, "Avg Percentage", 1, 1, 'C')
        
        pdf.set_font('Arial', '', 12)
        for q in stats['question_stats']:
            pdf.cell(20, 10, str(q['question_number']), 1, 0, 'C')
            pdf.cell(30, 10, str(q['max_marks']), 1, 0, 'C')
            pdf.cell(30, 10, str(q['avg_score']), 1, 0, 'C')
            pdf.cell(30, 10, str(q['max_score']), 1, 0, 'C')
            pdf.cell(30, 10, str(q['min_score']), 1, 0, 'C')
            pdf.cell(40, 10, f"{q['avg_percentage']}%", 1, 1, 'C')
        
        # Footer
        pdf.ln(10)
        pdf.set_font('Arial', 'I', 10)
        pdf.cell(0, 10, f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", 0, 1, 'C')
        
        # Save the PDF
        report_filename = f"exam_report_{exam_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
        report_path = os.path.join(self.reports_dir, report_filename)
        pdf.output(report_path)
        
        return report_path
