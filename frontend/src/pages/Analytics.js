// pages/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    CircularProgress,
    Button,
    TextField,
    InputAdornment,
    Autocomplete
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
  } from 'recharts';
  
  import {
    School,
    Search,
    Download
  } from '@mui/icons-material';
  
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
    const navigate = useNavigate();

    const [selectedExam, setSelectedExam] = useState(null);
    const [exams, setExams] = useState([
        { id: 1, title: 'Mid-term Science Test', class: 'Class 10A', subject: 'Science' },
        { id: 2, title: 'Mathematics Quiz', class: 'Class 9B', subject: 'Mathematics' },
        { id: 3, title: 'English Literature', class: 'Class 11C', subject: 'English' },
        { id: 4, title: 'History Final Exam', class: 'Class 10B', subject: 'History' },
    ]);

    const [loading, setLoading] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [questionPerformance, setQuestionPerformance] = useState([
        { question: "Q1", avgScore: 72 },
        { question: "Q2", avgScore: 68 },
        { question: "Q3", avgScore: 85 },
        { question: "Q4", avgScore: 78 },
        { question: "Q5", avgScore: 92 }
    ]);
    const [subjectDistribution, setSubjectDistribution] = useState([
        { subject: "Science", students: 65 },
        { subject: "Mathematics", students: 80 },
        { subject: "History", students: 55 },
        { subject: "English", students: 70 },
    ]);
    const examPerformanceData = [
        { name: 'Science', score: 76 },
        { name: 'Math', score: 85 },
        { name: 'English', score: 78 },
        { name: 'History', score: 62 },
        { name: 'Geography', score: 71 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        // Simulate loading data from an API
        setLoading(true);
        setTimeout(() => {
            setAnalyticsData({
                avgScore: 75.5,
                highestScore: 98,
                lowestScore: 42,
                totalStudents: 240,
                classAverage: {
                    "Class 10A": 78.2,
                    "Class 9B": 72.5,
                    "Class 11C": 80.1
                },
                scoreDistribution: [
                    { range: "0-20", count: 10 },
                    { range: "21-40", count: 25 },
                    { range: "41-60", count: 50 },
                    { range: "61-80", count: 70 },
                    { range: "81-100", count: 85 }
                ]
            });
            setLoading(false);
        }, 2000);
    }, [selectedExam]);

    const handleExamSelect = (event, newValue) => {
        setSelectedExam(newValue);
    };

    const downloadReport = () => {
        // Placeholder for report download functionality
        alert("Downloading report...");
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Analytics Dashboard
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={exams}
                            getOptionLabel={(option) => option.title}
                            onChange={handleExamSelect}
                            sx={{ width: "100%" }}
                            renderInput={(params) => <TextField {...params} label="Select Exam" />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Download />}
                            onClick={downloadReport}
                            disabled={!selectedExam}
                        >
                            Download Report
                        </Button>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                    </Box>
                ) : analyticsData ? (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Average Score
                                        </Typography>
                                        <Typography variant="h5" color="text.secondary">
                                            {analyticsData.avgScore}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Highest Score
                                        </Typography>
                                        <Typography variant="h5" color="text.secondary">
                                            {analyticsData.highestScore}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            Total Students
                                        </Typography>
                                        <Typography variant="h5" color="text.secondary">
                                            {analyticsData.totalStudents}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6">Class Average</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={Object.entries(analyticsData.classAverage).map(([name, value]) => ({ name, value }))}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#8884d8" name="Average Score" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6">Score Distribution</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={analyticsData.scoreDistribution.map(item => ({ name: item.range, value: item.count }))}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="value" fill="#82ca9d" name="Number of Students" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6">Subject Distribution</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={subjectDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="students"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {subjectDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Typography variant="h6">Question Performance</Typography>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={questionPerformance}>
                                            <XAxis dataKey="question" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="avgScore" fill="#8884d8" name="Average Score" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <Typography variant="body1">No analytics data available for the selected exam.</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Analytics;
