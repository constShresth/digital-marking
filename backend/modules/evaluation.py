# modules/evaluation.py
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class EvaluationEngine:
    def __init__(self):
        # Initialize NLTK components
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
    def preprocess_text(self, text):
        """Preprocess text for evaluation"""
        # Tokenize
        tokens = word_tokenize(text.lower())
        
        # Remove punctuation and stopwords
        tokens = [token for token in tokens if token not in string.punctuation]
        tokens = [token for token in tokens if token not in self.stop_words]
        
        # Lemmatize
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens]
        
        return ' '.join(tokens)
    
    def keyword_matching(self, student_answer, keywords):
        """
        Check for presence of keywords in student answer
        Returns a tuple of (matched_keywords, match_ratio)
        """
        # Preprocess student answer
        processed_answer = self.preprocess_text(student_answer)
        
        # Check for keyword matches
        matched_keywords = []
        for keyword in keywords:
            # Preprocess keyword
            processed_keyword = self.preprocess_text(keyword)
            
            # Check if keyword is in the answer
            if processed_keyword in processed_answer:
                matched_keywords.append(keyword)
        
        # Calculate match ratio
        match_ratio = len(matched_keywords) / len(keywords) if keywords else 0
        
        return matched_keywords, match_ratio
    
    def semantic_similarity(self, student_answer, model_answer):
        """
        Calculate semantic similarity between student answer and model answer
        Returns a similarity score between 0 and 1
        """
        # Preprocess texts
        processed_student = self.preprocess_text(student_answer)
        processed_model = self.preprocess_text(model_answer)
        
        # Create TF-IDF vectors
        vectorizer = TfidfVectorizer()
        try:
            tfidf_matrix = vectorizer.fit_transform([processed_model, processed_student])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        except:
            # Handle case where vectorization fails (e.g., empty texts)
            similarity = 0
        
        return similarity
    
    def evaluate_answer(self, student_answer, model_answer, keywords, max_score):
        """
        Evaluate a student answer against a model answer and keywords
        Returns a tuple of (score, feedback)
        """
        # Check for empty answer
        if not student_answer or student_answer.isspace():
            return 0, "No answer provided."
        
        # Keyword matching
        matched_keywords, keyword_ratio = self.keyword_matching(student_answer, keywords)
        
        # Semantic similarity
        similarity = self.semantic_similarity(student_answer, model_answer)
        
        # Calculate score
        # Weight: 60% keyword matching, 40% semantic similarity
        weighted_score = (0.6 * keyword_ratio + 0.4 * similarity) * max_score
        score = min(round(weighted_score, 1), max_score)  # Round to 1 decimal place
        
        # Generate feedback
        feedback = self._generate_feedback(student_answer, model_answer, matched_keywords, keywords, similarity)
        
        return score, feedback
    
    def _generate_feedback(self, student_answer, model_answer, matched_keywords, all_keywords, similarity):
        """Generate feedback for the student"""
        feedback = []
        
        # Missing keywords feedback
        missing_keywords = [k for k in all_keywords if k not in matched_keywords]
        if missing_keywords:
            feedback.append(f"Your answer is missing key concepts: {', '.join(missing_keywords)}.")
        
        # Similarity feedback
        if similarity < 0.3:
            feedback.append("Your answer differs significantly from the expected response.")
        elif similarity < 0.6:
            feedback.append("Your answer partially addresses the question.")
        else:
            feedback.append("Your answer aligns well with the expected response.")
        
        # Length feedback
        student_length = len(student_answer.split())
        model_length = len(model_answer.split())
        
        if student_length < model_length * 0.5:
            feedback.append("Your answer is too brief. Consider providing more details.")
        elif student_length > model_length * 2:
            feedback.append("Your answer is unnecessarily long. Try to be more concise.")
        
        return " ".join(feedback)
