import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import './sweetalert-custom.css';
import Profile from './pages/Profile';
import Belajar from './pages/Belajar';
import QuizSession from './components/QuizSession';
import QuizResult from './components/QuizResult';
import About from './pages/About';
import ModelInfo from './components/ModelInfo';

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<About />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:quizId/result" element={<QuizResult />} />
        <Route path="/model-info" element={<ModelInfo />} />
        <Route path="/quiz/:quizId" element={<QuizSession />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/belajar" element={<Belajar />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;