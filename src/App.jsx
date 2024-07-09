import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Quiz from './pages/Quiz';
import { supabase } from './supabaseClient';
import './sweetalert-custom.css';
import Profile from './pages/Profile';
import { UserProvider, useUser } from './context/UserContext';
import Belajar from './pages/Belajar';
import QuizSession from './components/QuizSession';
import QuizResult from './components/QuizResult';
import About from './pages/About';
import ModelInfo from './components/ModelInfo';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppRoutes() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check current session when component mounts
    supabase.auth.getSession().then(
      ({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching session:", error);
        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading component
  }

  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tentang" element={<About />} />
        <Route 
          path="/quiz" 
          element={<ProtectedRoute><Quiz /></ProtectedRoute>} 
        />
        <Route 
          path="/quiz/:quizId/result" 
          element={<ProtectedRoute><QuizResult /></ProtectedRoute>} 
        />
        <Route path="/model-info" element={<ModelInfo />} />
        <Route 
          path="/quiz/:quizId" 
          element={<ProtectedRoute><QuizSession /></ProtectedRoute>} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
        <Route path="/belajar" element={<Belajar />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;