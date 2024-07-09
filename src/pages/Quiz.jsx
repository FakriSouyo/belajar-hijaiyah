import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Quiz = () => {
  const { user } = useUser();
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Quiz Hijaiyah 1', description: 'alif, beh, teh, theh, jeem' },
    { id: 2, title: 'Quiz Hijaiyah 2', description: 'hah, khah, dal, thal, reh' },
    { id: 3, title: 'Quiz Hijaiyah 3', description: 'zain, seen, sheen, sad, dad, tah' },
    { id: 4, title: 'Quiz Hijaiyah 4', description: 'zah, ain, ghain, feh, qaf, kaf'},
    { id: 5, title: 'Quiz Hijaiyah 5', description: 'lam, meem, noon, heh, waw, yeh'},
  ]);

  useEffect(() => {
    if (user && user.id) {
      fetchTotalPoints();
      loadCompletedQuizzes();
    }
  }, [user]);
  const fetchTotalPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .single();
  
      if (error) {
        if (error.code === 'PGRST116') {
          // User tidak ditemukan, inisialisasi dengan 0 poin
          const { data: newPoints, error: insertError } = await supabase
            .rpc('increment_points', { user_uuid: user.id, points_to_add: 0 });
  
          if (insertError) throw insertError;
          setTotalPoints(newPoints);
        } else {
          throw error;
        }
      } else {
        setTotalPoints(data.total_points);
      }
    } catch (error) {
      console.error('Error fetching/creating points:', error);
      setTotalPoints(0);
    }
  };
  
  const addPoints = async (pointsToAdd) => {
    try {
      const { data, error } = await supabase
        .rpc('increment_points', { user_uuid: user.id, points_to_add: pointsToAdd });
  
      if (error) throw error;
      setTotalPoints(data);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };
  const loadCompletedQuizzes = () => {
    const completed = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
    setCompletedQuizzes(completed);
  };

  const isQuizUnlocked = (quizId) => {
    if (quizId === 1) return true;
    return completedQuizzes.includes(quizId - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Quiz Huruf Hijaiyah</h1>
      <p className="mb-8">Total Points: {totalPoints}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            {isQuizUnlocked(quiz.id) ? (
              <Link 
                to={`/quiz/${quiz.id}`} 
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Mulai Quiz
              </Link>
            ) : (
              <button 
                className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                Terkunci
              </button>
            )}
            {completedQuizzes.includes(quiz.id) && (
              <span className="ml-2 text-green-500">✓ Selesai</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;