// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;




// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamsList from './pages/ExamsList';
import CreateExam from './pages/CreateExam';
import UploadAnswerSheet from './pages/UploadAnswerSheet';
import EvaluateAnswers from './pages/EvaluateAnswers';
import Analytics from './pages/Analytics';
import StudentResults from './pages/StudentResults';

// Import components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/exams" element={
            <PrivateRoute>
              <ExamsList />
            </PrivateRoute>
          } />
          <Route path="/exams/create" element={
            <PrivateRoute>
              <CreateExam />
            </PrivateRoute>
          } />
          <Route path="/upload/:examId" element={
            <PrivateRoute>
              <UploadAnswerSheet />
            </PrivateRoute>
          } />
          <Route path="/evaluate/:answerSheetId" element={
            <PrivateRoute>
              <EvaluateAnswers />
            </PrivateRoute>
          } />
          <Route path="/analytics/:examId" element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } />
          <Route path="/student/:studentId" element={
            <PrivateRoute>
              <StudentResults />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
