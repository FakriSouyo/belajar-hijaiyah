import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Quiz = () => {
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizScores, setQuizScores] = useState({});
  const [quizzes] = useState([
    { id: 1, title: 'Quiz Hijaiyah 1', description: 'alif, beh, teh, theh, jeem' },
    { id: 2, title: 'Quiz Hijaiyah 2', description: 'hah, khah, dal, thal, reh' },
    { id: 3, title: 'Quiz Hijaiyah 3', description: 'zain, seen, sheen, sad, dad, tah' },
    { id: 4, title: 'Quiz Hijaiyah 4', description: 'zah, ain, ghain, feh, qaf, kaf'},
    { id: 5, title: 'Quiz Hijaiyah 5', description: 'lam, meem, noon, heh, waw, yeh'},
  ]);

  useEffect(() => {
    // Load completed quizzes from cookies
    const savedCompletedQuizzes = Cookies.get('completedQuizzes');
    if (savedCompletedQuizzes) {
      setCompletedQuizzes(JSON.parse(savedCompletedQuizzes));
    }

    // Load quiz scores
    const savedQuizScores = Cookies.get('quizScores');
    if (savedQuizScores) {
      setQuizScores(JSON.parse(savedQuizScores));
    }

    // Load average points
    const savedPoints = Cookies.get('totalPoints');
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }
  }, []);

  const isQuizUnlocked = (quizId) => {
    if (quizId === 1) return true;
    return completedQuizzes.includes(quizId - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Quiz Huruf Hijaiyah</h1>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <p className="text-xl font-semibold">Rata-rata Skor: {totalPoints} / 100</p>
        <p className="text-sm text-gray-600">
          (Dari {Object.keys(quizScores).length} quiz yang telah diselesaikan)
        </p>
      </div>
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
              <div className="mt-2">
                <span className="text-green-500">✓ Selesai</span>
                <span className="ml-2">
                  Skor: {quizScores[quiz.id] || 0}/100
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;