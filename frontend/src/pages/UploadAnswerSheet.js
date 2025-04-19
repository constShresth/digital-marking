// pages/UploadAnswerSheet.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material';
import { 
  CloudUpload, 
  ArrowBack, 
  ArrowForward, 
  Check,
  Clear,
  CheckCircle,
  FileUpload
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

const UploadAnswerSheet = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [activeStep, setActiveStep] = useState(0);
  const [exams, setExams] = useState([
    { id: 1, title: 'Mid-term Science Test', class: 'Class 10A', subject: 'Science' },
    { id: 2, title: 'Mathematics Quiz', class: 'Class 9B', subject: 'Mathematics' },
    { id: 3, title: 'English Literature', class: 'Class 11C', subject: 'English' },
    { id: 4, title: 'History Final Exam', class: 'Class 10B', subject: 'History' },
  ]);
  
  const [selectedExam, setSelectedExam] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedText, setProcessedText] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm();
  
  const steps = ['Select Exam', 'Upload Answer Sheet', 'Verify Extracted Text'];
  
  useEffect(() => {
    if (examId) {
      const exam = exams.find(e => e.id === parseInt(examId));
      if (exam) {
        setSelectedExam(exam);
        setValue('examId', exam.id);
        setActiveStep(1); // Skip to upload step
      }
    }
  }, [examId, exams, setValue]);
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleExamSelect = (event) => {
    const examId = event.target.value;
    const exam = exams.find(e => e.id === examId);
    setSelectedExam(exam);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };
  
  const handleFileUpload = () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          simulateProcessing();
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  const simulateProcessing = () => {
    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      // Mock extracted text from OCR
      setProcessedText({
        q1: "Photosynthesis is the process by which plants convert light energy into chemical energy. It takes place in the chloroplasts of plant cells.",
        q2: "The water cycle involves evaporation, condensation, precipitation, and collection. It is a continuous process that circulates water throughout Earth's systems.",
        q3: "Mitochondria are the powerhouse of the cell. They are responsible for cellular respiration and producing ATP, which is the energy currency of cells.",
        q4: "Newton's third law states that for every action, there is an equal and opposite reaction. This fundamental principle explains many everyday phenomena.",
        q5: "The human digestive system consists of organs that break down food into nutrients that can be absorbed by the body. It includes the mouth, esophagus, stomach, small intestine, and large intestine."
      });
      
      setIsProcessing(false);
      handleNext();
    }, 3000);
  };
  
  const onSubmitStep1 = (data) => {
    handleNext();
  };
  
  const onSubmitStep3 = (data) => {
    // In a real app, you would send the verified OCR data to your API
    console.log('Submitting verified data:', data);
    
    setAlert({
      open: true,
      message: 'Answer sheet processed successfully! Redirecting to evaluation...',
      severity: 'success'
    });
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/evaluate/new');
    }, 2000);
  };
  
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Upload Answer Sheet
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/exams')}
        >
          Back to Exams
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Step 1: Select Exam */}
        {activeStep === 0 && (
          <form onSubmit={handleSubmit(onSubmitStep1)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Select Exam
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="examId"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Please select an exam' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.examId}>
                      <InputLabel id="exam-select-label">Exam</InputLabel>
                      <Select
                        labelId="exam-select-label"
                        id="exam-select"
                        label="Exam"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleExamSelect(e);
                        }}
                      >
                        {exams.map((exam) => (
                          <MenuItem key={exam.id} value={exam.id}>
                            {exam.title} - {exam.class} ({exam.subject})
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.examId && (
                        <Typography variant="caption" color="error">
                          {errors.examId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  type="submit"
                  variant="contained" 
                  color="primary" 
                  endIcon={<ArrowForward />}
                  disabled={!selectedExam}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        
        {/* Step 2: Upload Answer Sheet */}
        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Upload Answer Sheet
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Selected Exam</AlertTitle>
                {selectedExam?.title} - {selectedExam?.class} ({selectedExam?.subject})
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student ID"
                variant="outlined"
                required
                disabled={isUploading || isProcessing}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student Name"
                variant="outlined"
                required
                disabled={isUploading || isProcessing}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  mb: 3
                }}
              >
                <input
                  accept="image/*,application/pdf"
                  id="upload-answer-sheet"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  disabled={isUploading || isProcessing}
                />
                <label htmlFor="upload-answer-sheet">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<FileUpload />}
                    disabled={isUploading || isProcessing}
                  >
                    Select File
                  </Button>
                </label>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {uploadedFile ? uploadedFile.name : 'No file selected'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Supported formats: JPG, PNG, PDF (max 10MB)
                </Typography>
              </Box>
            </Grid>
            {uploadedFile && (
              <Grid item xs={12}>
                {isUploading || uploadProgress > 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        size={60}
                        thickness={4}
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
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">
                          {`${Math.round(uploadProgress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {uploadProgress < 100 
                        ? 'Uploading...' 
                        : isProcessing 
                          ? 'Processing with OCR...' 
                          : 'Upload complete!'}
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudUpload />}
                    onClick={handleFileUpload}
                    fullWidth
                  >
                    Upload and Process
                  </Button>
                )}
              </Grid>
            )}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBack />}
                onClick={handleBack}
                disabled={isUploading || isProcessing}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                endIcon={<ArrowForward />}
                onClick={handleNext}
                disabled={!uploadedFile || uploadProgress < 100 || isProcessing}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        )}
        
        {/* Step 3: Verify Extracted Text */}
        {activeStep === 2 && (
          <form onSubmit={handleSubmit(onSubmitStep3)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Verify Extracted Text
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>OCR Processing Complete</AlertTitle>
                  The system has extracted text from the answer sheet. Please review and make any necessary corrections before proceeding.
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell width="15%">Question</TableCell>
                        <TableCell width="85%">Extracted Answer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(processedText).map(([question, text]) => (
                        <TableRow key={question}>
                          <TableCell>{question.toUpperCase()}</TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              defaultValue={text}
                              variant="outlined"
                              {...register(`answers.${question}`)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  variant="contained" 
                  color="primary" 
                  endIcon={<Check />}
                >
                  Submit for Evaluation
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
      
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadAnswerSheet;
