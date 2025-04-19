// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button
} from '@mui/material';
import { 
  School,
  Assignment,
  // BarChart,
  PeopleAlt,
  AccessTime,
  Check
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    exams: 12,
    pendingEvaluation: 24,
    completedEvaluation: 86,
    students: 320
  });
  
  const [recentExams, setRecentExams] = useState([
    { id: 1, title: 'Mid-term Science Test', date: '2025-04-15', class: 'Class 10A', status: 'Completed' },
    { id: 2, title: 'Mathematics Quiz', date: '2025-04-12', class: 'Class 9B', status: 'Pending' },
    { id: 3, title: 'English Literature', date: '2025-04-10', class: 'Class 11C', status: 'Completed' },
    { id: 4, title: 'History Final Exam', date: '2025-04-05', class: 'Class 10B', status: 'Completed' },
  ]);
  
  const evaluationData = [
    { name: 'Completed', value: stats.completedEvaluation },
    { name: 'Pending', value: stats.pendingEvaluation },
  ];
  
  const COLORS = ['#4caf50', '#ff9800'];
  
  const performanceData = [
    { name: 'Science', score: 76 },
    { name: 'Math', score: 85 },
    { name: 'English', score: 78 },
    { name: 'History', score: 62 },
    { name: 'Geography', score: 71 },
  ];
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome, {currentUser?.name || 'Teacher'}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Card sx={{ height: '100%', bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#1976d2', mb: 2 }}>
                  <School />
                </Avatar>
                <Typography variant="h5" component="div">
                  {stats.exams}
                </Typography>
                <Typography color="text.secondary">
                  Total Exams
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Card sx={{ height: '100%', bgcolor: '#fff8e1', borderRadius: 2 }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#ff9800', mb: 2 }}>
                  <Assignment />
                </Avatar>
                <Typography variant="h5" component="div">
                  {stats.pendingEvaluation}
                </Typography>
                <Typography color="text.secondary">
                  Pending Evaluations
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Card sx={{ height: '100%', bgcolor: '#e8f5e9', borderRadius: 2 }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#4caf50', mb: 2 }}>
                  <Check />
                </Avatar>
                <Typography variant="h5" component="div">
                  {stats.completedEvaluation}
                </Typography>
                <Typography color="text.secondary">
                  Completed Evaluations
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Card sx={{ height: '100%', bgcolor: '#e0f7fa', borderRadius: 2 }}>
              <CardContent>
                <Avatar sx={{ bgcolor: '#00acc1', mb: 2 }}>
                  <PeopleAlt />
                </Avatar>
                <Typography variant="h5" component="div">
                  {stats.students}
                </Typography>
                <Typography color="text.secondary">
                  Students
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Evaluation Progress
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={evaluationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {evaluationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Subject Performance
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={performanceData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" name="Avg. Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Recent Exams */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Exams
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/exams')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentExams.map((exam) => (
                <React.Fragment key={exam.id}>
                  <ListItem
                    secondaryAction={
                      <Button 
                        variant="outlined" 
                        color={exam.status === 'Completed' ? 'success' : 'warning'}
                        onClick={() => navigate(`/evaluate/${exam.id}`)}
                      >
                        {exam.status === 'Completed' ? 'View Results' : 'Evaluate'}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {exam.status === 'Completed' ? <Check /> : <AccessTime />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={exam.title}
                      secondary={`${exam.class} | ${new Date(exam.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  startIcon={<School />} 
                  fullWidth 
                  onClick={() => navigate('/exams/create')}
                >
                  Create Exam
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Assignment />} 
                  fullWidth
                  onClick={() => navigate('/upload')}
                >
                  Upload Answer Sheets
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<BarChart />} 
                  fullWidth
                  onClick={() => navigate('/analytics')}
                >
                  View Analytics
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  color="info" 
                  startIcon={<PeopleAlt />} 
                  fullWidth
                  onClick={() => navigate('/students')}
                >
                  Student Results
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
