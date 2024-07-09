import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const { answers } = location.state || { answers: [] };
  
    useEffect(() => {
      if (user && answers) {
        saveQuizResult();
      }
    }, [user, answers]);
  
    const saveQuizResult = async () => {
        const totalPoints = answers.reduce((sum, answer) => sum + answer.score, 0);
        
        try {
          const { data, error } = await supabase
            .rpc('increment_points', { user_uuid: user.id, points_to_add: totalPoints });
      
          if (error) throw error;
          console.log('Quiz result saved successfully');
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      };
  
  const handleFinish = () => {
    navigate('/quiz');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Hasil Quiz</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Daftar Soal dan Skor:</h2>
        <ul className="mb-4">
          {answers.map((answer, index) => (
            <li key={index} className="mb-2">
              Huruf {answer.letter}: {answer.score} poin
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold">
          Total Skor: {answers.reduce((sum, answer) => sum + answer.score, 0)} poin
        </p>
        <button 
          onClick={handleFinish} 
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Kembali ke Daftar Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResult;