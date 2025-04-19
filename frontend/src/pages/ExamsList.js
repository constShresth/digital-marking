// pages/ExamsList.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Upload, 
  BarChart,
  Search
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ExamsList = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([
    { 
      id: 1, 
      title: 'Mid-term Science Test', 
      subject: 'Science',
      class: 'Class 10A', 
      date: '2025-04-15',
      status: 'Active',
      totalAnswerSheets: 42,
      evaluatedAnswerSheets: 42,
      averageScore: 72.5
    },
    { 
      id: 2, 
      title: 'Mathematics Quiz', 
      subject: 'Mathematics',
      class: 'Class 9B', 
      date: '2025-04-12',
      status: 'Active',
      totalAnswerSheets: 38,
      evaluatedAnswerSheets: 29,
      averageScore: 68.2
    },
    { 
      id: 3, 
      title: 'English Literature', 
      subject: 'English',
      class: 'Class 11C', 
      date: '2025-04-10',
      status: 'Completed',
      totalAnswerSheets: 45,
      evaluatedAnswerSheets: 45,
      averageScore: 76.8
    },
    { 
      id: 4, 
      title: 'History Final Exam', 
      subject: 'History',
      class: 'Class 10B', 
      date: '2025-04-05',
      status: 'Completed',
      totalAnswerSheets: 40,
      evaluatedAnswerSheets: 40,
      averageScore: 65.3
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.class.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteClick = (exam) => {
    setExamToDelete(exam);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    // Filter out the exam to delete
    setExams(exams.filter(exam => exam.id !== examToDelete.id));
    setDeleteDialogOpen(false);
    setExamToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExamToDelete(null);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Exams
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={() => navigate('/exams/create')}
        >
          Create Exam
        </Button>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search exams by title, subject, or class..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Avg. Score</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={exam.status} 
                      color={exam.status === 'Active' ? 'primary' : 'success'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {`${exam.evaluatedAnswerSheets}/${exam.totalAnswerSheets}`}
                    <Box
                      sx={{
                        width: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: 5,
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: `${(exam.evaluatedAnswerSheets / exam.totalAnswerSheets) * 100}%`,
                          backgroundColor: '#4caf50',
                          height: 8,
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{exam.averageScore}%</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/exams/edit/${exam.id}`)}
                      title="Edit exam"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      onClick={() => navigate(`/upload/${exam.id}`)}
                      title="Upload answer sheets"
                    >
                      <Upload />
                    </IconButton>
                    <IconButton 
                      color="info" 
                      onClick={() => navigate(`/analytics/${exam.id}`)}
                      title="View analytics"
                    >
                      <BarChart />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(exam)}
                      title="Delete exam"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredExams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No exams found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the exam "{examToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamsList;
