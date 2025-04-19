// pages/StudentResults.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Button,
} from '@mui/material';
import {
    Search,
    Download,
    ExpandMore,
    School
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const StudentResults = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [studentResults, setStudentResults] = useState([
        {
            studentID: 1234,
            name: "John Doe",
            className: "10A",
            result: [
                { examName: "Science", score: 85, totalScore: 100, teacherScore: 88 },
                { examName: "Math", score: 78, totalScore: 100, teacherScore: 79 },
                { examName: "English", score: 92, totalScore: 100, teacherScore: 90 }
            ]
        },
        {
            studentID: 5678,
            name: "Jane Smith",
            className: "10B",
            result: [
                { examName: "Science", score: 90, totalScore: 100, teacherScore: 92 },
                { examName: "Math", score: 85, totalScore: 100, teacherScore: 83 },
                { examName: "English", score: 88, totalScore: 100, teacherScore: 86 }
            ]
        }
    ]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [expanded, setExpanded] = React.useState(null);
    useEffect(() => {
        // Mock data loading
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        // If studentId is provided, select the student
        if (studentId) {
            const student = studentResults.find((s) => s.studentID === parseInt(studentId));
            setSelectedStudent(student);
        }
    }, [studentId]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        navigate(`/students/${student.studentID}`); // Navigate to student-specific URL
    };

    const handleDownload = () => {
        alert("Downloading results");
    };
    const filteredStudents = studentResults.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentID.toString().includes(searchTerm)
    );
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Student Results
                </Typography>
            </Box>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search for students by name or ID"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: "200px" }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.studentID} hover onClick={() => handleStudentSelect(student)} style={{ cursor: "pointer" }}>
                                        <TableCell>{student.studentID}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.className}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<School />}
                                                onClick={() => handleStudentSelect(student)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
            {selectedStudent && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">
                            Results for {selectedStudent.name} ({selectedStudent.studentID})
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Download />}
                            onClick={handleDownload}
                        >
                            Download Results
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {selectedStudent.result.map((exam, index) => (
                            <Grid item xs={12} key={index}>
                                <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls={`panel${index}a-content`}
                                        id={`panel${index}a-header`}
                                    >
                                        <Typography>
                                            {exam.examName} - {exam.score}/{exam.totalScore}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                                                    <Typography variant="h6"> AI Score: {exam.score} / {exam.totalScore} </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Paper elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                                                    <Typography variant="h6">Teacher Score: {exam.teacherScore} / {exam.totalScore} </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}
        </Box>
    );
};

export default StudentResults;
