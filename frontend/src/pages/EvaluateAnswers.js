// pages/EvaluateAnswers.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  ExpandMore, 
  ArrowBack, 
  Check,
  Warning,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  School
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const EvaluateAnswers = () => {
  const navigate = useNavigate();
  const { answerSheetId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [answerSheet, setAnswerSheet] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editedScore, setEditedScore] = useState(0);
  const [editedFeedback, setEditedFeedback] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // Mock answer sheet data
      const mockAnswerSheet = {
        id: answerSheetId || 'new',
        examTitle: 'Mid-term Science Test',
        examClass: 'Class 10A',
        studentId: 'STU2025042',
        studentName: 'John Smith',
        uploadDate: '2025-04-19T10:30:00',
        status: 'Pending Evaluation'
      };
      
      // Mock evaluation results
      const mockResults = {
        totalScore: 0,
        maxScore: 50,
        answers: [
          {
            id: 1,
            questionNumber: 1,
            questionText: 'Explain the process of photosynthesis.',
            studentAnswer: "Photosynthesis is the process by which plants convert light energy into chemical energy. It takes place in the chloroplasts of plant cells.",
            modelAnswer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.",
            keywords: ['photosynthesis', 'light energy', 'chemical energy', 'chloroplasts', 'plants'],
            matchedKeywords: ['photosynthesis', 'light energy', 'chemical energy', 'plants'],
            aiScore: 8.5,
            maxScore: 10,
            teacherScore: null,
            aiConfidence: 0.85,
            feedback: "Good explanation. You mentioned most key concepts. Consider including the role of chlorophyll next time.",
            needsReview: false
          },
          {
            id: 2,
            questionNumber: 2,
            questionText: 'Describe the water cycle.',
            studentAnswer: "The water cycle involves evaporation, condensation, precipitation, and collection. It is a continuous process that circulates water throughout Earth's systems.",
            modelAnswer: "The water cycle is the continuous movement of water within the Earth and atmosphere through evaporation, condensation, precipitation, and collection.",
            keywords: ['water cycle', 'evaporation', 'condensation', 'precipitation', 'collection'],
            matchedKeywords: ['water cycle', 'evaporation', 'condensation', 'precipitation', 'collection'],
            aiScore: 8,
            maxScore: 8,
            teacherScore: null,
            aiConfidence: 0.95,
            feedback: "Excellent answer. You included all key components of the water cycle.",
            needsReview: false
          },
          {
            id: 3,
            questionNumber: 3,
            questionText: 'What are mitochondria and their function?',
            studentAnswer: "Mitochondria are the powerhouse of the cell. They are responsible for cellular respiration and producing ATP, which is the energy currency of cells.",
            modelAnswer: "Mitochondria are membrane-bound cell organelles that generate most of the chemical energy needed to power the cell's biochemical reactions.",
            keywords: ['mitochondria', 'powerhouse', 'cell', 'cellular respiration', 'energy', 'ATP'],
            matchedKeywords: ['mitochondria', 'powerhouse', 'cell', 'cellular respiration', 'energy', 'ATP'],
            aiScore: 10,
            maxScore: 10,
            teacherScore: null,
            aiConfidence: 0.9,
            feedback: "Perfect answer. You correctly identified mitochondria as the powerhouse of the cell and explained their function in energy production.",
            needsReview: false
          },
          {
            id: 4,
            questionNumber: 4,
            questionText: 'State and explain Newton\'s third law of motion.',
            studentAnswer: "Newton's third law states that for every action, there is an equal and opposite reaction. This fundamental principle explains many everyday phenomena.",
            modelAnswer: "Newton's third law of motion states that for every action, there is an equal and opposite reaction. This means that forces always occur in pairs.",
            keywords: ['Newton', 'third law', 'action', 'reaction', 'equal', 'opposite'],
            matchedKeywords: ['Newton', 'third law', 'action', 'reaction', 'equal', 'opposite'],
            aiScore: 9,
            maxScore: 12,
            teacherScore: null,
            aiConfidence: 0.75,
            feedback: "Good statement of the law. To improve, include specific examples and explain how forces occur in pairs.",
            needsReview: true
          },
          {
            id: 5,
            questionNumber: 5,
            questionText: 'Explain the human digestive system.',
            studentAnswer: "The human digestive system consists of organs that break down food into nutrients that can be absorbed by the body. It includes the mouth, esophagus, stomach, small intestine, and large intestine.",
            modelAnswer: "The human digestive system is a series of organs that work together to convert food into nutrients and energy. The main organs include the mouth, esophagus, stomach, small intestine, large intestine, liver, and pancreas.",
            keywords: ['digestive system', 'mouth', 'esophagus', 'stomach', 'small intestine', 'large intestine', 'nutrients'],
            matchedKeywords: ['digestive system', 'mouth', 'esophagus', 'stomach', 'small intestine', 'large intestine', 'nutrients'],
            aiScore: 7.5,
            maxScore: 10,
            teacherScore: null,
            aiConfidence: 0.65,
            feedback: "Good basic explanation. Your answer is missing mention of the liver and pancreas, which are important accessory organs in digestion.",
            needsReview: true
          }
        ]
      };
      
      // Calculate total score
      mockResults.totalScore = mockResults.answers.reduce((sum, answer) => sum + answer.aiScore, 0);
      
      setAnswerSheet(mockAnswerSheet);
      setEvaluationResults(mockResults);
      setLoading(false);
    }, 1500);
  }, [answerSheetId]);
  
  const handleEditClick = (answer) => {
    setEditingAnswer(answer);
    setEditedScore(answer.teacherScore !== null ? answer.teacherScore : answer.aiScore);
    setEditedFeedback(answer.feedback);
  };
  
  const handleSaveEdit = () => {
    const updatedAnswers = evaluationResults.answers.map(answer => 
      answer.id === editingAnswer.id 
        ? { 
            ...answer, 
            teacherScore: editedScore, 
            feedback: editedFeedback,
            needsReview: false 
          } 
        : answer
    );
    
    // Calculate new total score
    const newTotalScore = updatedAnswers.reduce((sum, answer) => {
      const scoreToUse = answer.teacherScore !== null ? answer.teacherScore : answer.aiScore;
      return sum + scoreToUse;
    }, 0);
    
    setEvaluationResults({
      ...evaluationResults,
      answers: updatedAnswers,
      totalScore: newTotalScore
    });
    
    setEditingAnswer(null);
  };
  
  const handleCancelEdit = () => {
    setEditingAnswer(null);
  };
  
  const handleSubmitEvaluation = () => {
    setDialogOpen(true);
  };
  
  const handleConfirmSubmit = () => {
    setDialogOpen(false);
    
    // In a real app, you would send the evaluation results to your API
    
    setAlert({
      open: true,
      message: 'Evaluation submitted successfully!',
      severity: 'success'
    });
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };
  
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  
  // Calculate score percentage
  const scorePercentage = evaluationResults 
    ? (evaluationResults.totalScore / evaluationResults.maxScore) * 100 
    : 0;
    
  // Determine grade based on percentage
  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };
  
  const grade = getGrade(scorePercentage);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading answer sheet...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Evaluate Answer Sheet
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/exams')}
        >
          Back to Exams
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Answer Sheet Info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Answer Sheet Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Exam:</strong> {answerSheet.examTitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Class:</strong> {answerSheet.examClass}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Student ID:</strong> {answerSheet.studentId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Student Name:</strong> {answerSheet.studentName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Upload Date:</strong> {new Date(answerSheet.uploadDate).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Status:</strong> 
                  <Chip 
                    label={answerSheet.status} 
                    color={answerSheet.status === 'Evaluated' ? 'success' : 'warning'} 
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Score Summary */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evaluation Summary
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={scorePercentage} 
                    size={120}
                    thickness={4}
                    color={
                      scorePercentage >= 80 ? 'success' :
                      scorePercentage >= 60 ? 'primary' :
                      scorePercentage >= 40 ? 'warning' : 'error'
                    }
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h4" component="div" color="text.secondary">
                      {grade}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {scorePercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="h6" align="center" gutterBottom>
                {evaluationResults.totalScore.toFixed(1)}/{evaluationResults.maxScore}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Answers requiring review: {evaluationResults.answers.filter(a => a.needsReview).length}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                AI confidence: {(evaluationResults.answers.reduce((sum, a) => sum + a.aiConfidence, 0) / evaluationResults.answers.length).toFixed(2) * 100}%
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                startIcon={<CheckCircle />}
                sx={{ mt: 3 }}
                onClick={handleSubmitEvaluation}
              >
                Submit Evaluation
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Answers Evaluation */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Answers Evaluation
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {evaluationResults.answers.map((answer) => (
              <Accordion 
                key={answer.id} 
                defaultExpanded={answer.needsReview}
                sx={{
                  mb: 2,
                  border: answer.needsReview ? '1px solid #ff9800' : 'none',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: answer.needsReview ? '#fff8e1' : '#f5f5f5',
                    borderRadius: '4px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">
                      Question {answer.questionNumber}: {answer.questionText.substring(0, 50)}
                      {answer.questionText.length > 50 ? '...' : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {answer.needsReview && (
                        <Chip 
                          icon={<Warning />} 
                          label="Needs Review" 
                          color="warning" 
                          size="small"
                          sx={{ mr: 2 }}
                        />
                      )}
                      <Typography variant="subtitle1" color="primary">
                        {answer.teacherScore !== null ? answer.teacherScore : answer.aiScore}/{answer.maxScore}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">
                        Student Answer:
                      </Typography>
                      <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        {answer.studentAnswer}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">
                        Model Answer:
                      </Typography>
                      <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        {answer.modelAnswer}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Keywords
                        </Typography>
                        <Box>
                          {answer.keywords.map((keyword, index) => (
                            <Chip 
                              key={index}
                              label={keyword}
                              color={answer.matchedKeywords.includes(keyword) ? 'success' : 'default'}
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          AI Evaluation
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Score: {answer.aiScore}/{answer.maxScore}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Confidence: {(answer.aiConfidence * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="body2">
                          Keywords Matched: {answer.matchedKeywords.length}/{answer.keywords.length}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      {editingAnswer?.id === answer.id ? (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Teacher Score:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Slider
                              value={editedScore}
                              onChange={(e, newValue) => setEditedScore(newValue)}
                              step={0.5}
                              marks
                              min={0}
                              max={answer.maxScore}
                              valueLabelDisplay="auto"
                              sx={{ mr: 2 }}
                            />
                            <Typography variant="body1">
                              {editedScore}/{answer.maxScore}
                            </Typography>
                          </Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Feedback:
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={editedFeedback}
                            onChange={(e) => setEditedFeedback(e.target.value)}
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button 
                              variant="outlined" 
                              color="secondary" 
                              startIcon={<Cancel />}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              startIcon={<Save />}
                              onClick={handleSaveEdit}
                            >
                              Save
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Feedback:
                            </Typography>
                            <Button 
                              variant="outlined" 
                              size="small" 
                              startIcon={<Edit />}
                              onClick={() => handleEditClick(answer)}
                            >
                              Edit
                            </Button>
                          </Box>
                          <Typography variant="body1" paragraph>
                            {answer.feedback}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Submit Evaluation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit this evaluation? The student will be able to see the results.
          </DialogContentText>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Evaluation Summary:
            </Typography>
            <Typography variant="body2" gutterBottom>
              Student: {answerSheet.studentName} ({answerSheet.studentId})
            </Typography>
            <Typography variant="body2" gutterBottom>
              Total Score: {evaluationResults.totalScore.toFixed(1)}/{evaluationResults.maxScore} ({scorePercentage.toFixed(1)}%)
            </Typography>
            <Typography variant="body2">
              Grade: {grade}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" variant="contained" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EvaluateAnswers;
