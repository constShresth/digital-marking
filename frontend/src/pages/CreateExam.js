// pages/CreateExam.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Save, 
  Cancel,
  ArrowBack,
  Edit,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

const CreateExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const isEditMode = !!examId;
  
  const [questions, setQuestions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
  const { register: registerQuestion, handleSubmit: handleSubmitQuestion, control: controlQuestion, formState: { errors: questionErrors }, reset: resetQuestion } = useForm();
  
  useEffect(() => {
    if (isEditMode) {
      // Fetch exam data
      // This is a placeholder - in a real app, you would fetch from an API
      const examData = {
        id: 1,
        title: 'Mid-term Science Test',
        subject: 'Science',
        class: 'Class 10A',
        date: '2025-04-15',
        totalMarks: 100,
        questions: [
          {
            id: 1,
            questionNumber: 1,
            text: 'Explain the process of photosynthesis.',
            modelAnswer: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.',
            keywords: 'photosynthesis, sunlight, chlorophyll, plants, energy',
            maxMarks: 10
          },
          {
            id: 2,
            questionNumber: 2,
            text: 'Describe the water cycle.',
            modelAnswer: 'The water cycle is the continuous movement of water within the Earth and atmosphere through evaporation, condensation, precipitation, and collection.',
            keywords: 'water cycle, evaporation, condensation, precipitation, collection',
            maxMarks: 8
          }
        ]
      };
      
      reset({
        title: examData.title,
        subject: examData.subject,
        class: examData.class,
        date: examData.date,
        totalMarks: examData.totalMarks
      });
      
      setQuestions(examData.questions);
    }
  }, [isEditMode, examId, reset]);
  
  const onSubmit = (data) => {
    if (questions.length === 0) {
      setAlert({
        open: true,
        message: 'Please add at least one question to the exam.',
        severity: 'error'
      });
      return;
    }
    
    // Create the exam object to be saved
    const examData = {
      ...data,
      questions
    };
    
    console.log('Saving exam:', examData);
    
    // In a real app, you would send this to your API
    setAlert({
      open: true,
      message: `Exam ${isEditMode ? 'updated' : 'created'} successfully!`,
      severity: 'success'
    });
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/exams');
    }, 1500);
  };
  
  const handleAddQuestion = () => {
    setCurrentQuestion(null);
    resetQuestion({
      questionNumber: questions.length + 1,
      text: '',
      modelAnswer: '',
      keywords: '',
      maxMarks: ''
    });
    setDialogOpen(true);
  };
  
  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    resetQuestion({
      questionNumber: question.questionNumber,
      text: question.text,
      modelAnswer: question.modelAnswer,
      keywords: question.keywords,
      maxMarks: question.maxMarks
    });
    setDialogOpen(true);
  };
  
  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };
  
  const handleQuestionSubmit = (data) => {
    if (currentQuestion) {
      // Edit existing question
      setQuestions(questions.map(q => 
        q.id === currentQuestion.id ? { ...currentQuestion, ...data } : q
      ));
    } else {
      // Add new question
      setQuestions([
        ...questions,
        {
          id: Date.now(), // Use timestamp as temporary id
          ...data
        }
      ]);
    }
    
    setDialogOpen(false);
  };
  
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {isEditMode ? 'Edit Exam' : 'Create New Exam'}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/exams')}
        >
          Back to Exams
        </Button>
      </Box>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Exam Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Exam Title"
                variant="outlined"
                {...register('title', { required: 'Exam title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
                {...register('subject', { required: 'Subject is required' })}
                error={!!errors.subject}
                helperText={errors.subject?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Class"
                variant="outlined"
                placeholder="e.g., Class 10A"
                {...register('class', { required: 'Class is required' })}
                error={!!errors.class}
                helperText={errors.class?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Exam Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...register('date', { required: 'Exam date is required' })}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Total Marks"
                type="number"
                variant="outlined"
                {...register('totalMarks', { 
                  required: 'Total marks is required',
                  min: {
                    value: 1,
                    message: 'Total marks must be greater than 0'
                  } 
                })}
                error={!!errors.totalMarks}
                helperText={errors.totalMarks?.message}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Exam Questions
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />}
              onClick={handleAddQuestion}
            >
              Add Question
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="5%">No.</TableCell>
                  <TableCell width="35%">Question</TableCell>
                  <TableCell width="35%">Model Answer</TableCell>
                  <TableCell width="15%">Max Marks</TableCell>
                  <TableCell width="10%">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.questionNumber}</TableCell>
                    <TableCell>{question.text}</TableCell>
                    <TableCell>
                      {question.modelAnswer.length > 50 
                        ? `${question.modelAnswer.substring(0, 50)}...` 
                        : question.modelAnswer}
                    </TableCell>
                    <TableCell>{question.maxMarks}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {questions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No questions added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<Cancel />}
            onClick={() => navigate('/exams')}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            color="primary" 
            startIcon={<Save />}
          >
            {isEditMode ? 'Update Exam' : 'Create Exam'}
          </Button>
        </Box>
      </form>
      
      {/* Question Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmitQuestion(handleQuestionSubmit)}>
          <DialogTitle>
            {currentQuestion ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Question No."
                  type="number"
                  variant="outlined"
                  {...registerQuestion('questionNumber', { 
                    required: 'Question number is required',
                    min: {
                      value: 1,
                      message: 'Must be greater than 0'
                    } 
                  })}
                  error={!!questionErrors.questionNumber}
                  helperText={questionErrors.questionNumber?.message}
                />
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Question Text"
                  variant="outlined"
                  {...registerQuestion('text', { required: 'Question text is required' })}
                  error={!!questionErrors.text}
                  helperText={questionErrors.text?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Model Answer"
                  variant="outlined"
                  multiline
                  rows={4}
                  {...registerQuestion('modelAnswer', { required: 'Model answer is required' })}
                  error={!!questionErrors.modelAnswer}
                  helperText={questionErrors.modelAnswer?.message}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Keywords (comma separated)"
                  variant="outlined"
                  placeholder="e.g., photosynthesis, chlorophyll, plants"
                  {...registerQuestion('keywords', { required: 'Keywords are required' })}
                  error={!!questionErrors.keywords}
                  helperText={questionErrors.keywords?.message || 'Enter keywords that should be present in the answer, separated by commas'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Maximum Marks"
                  type="number"
                  variant="outlined"
                  {...registerQuestion('maxMarks', { 
                    required: 'Maximum marks is required',
                    min: {
                      value: 1,
                      message: 'Must be greater than 0'
                    } 
                  })}
                  error={!!questionErrors.maxMarks}
                  helperText={questionErrors.maxMarks?.message}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {currentQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateExam;
