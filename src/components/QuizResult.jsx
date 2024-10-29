import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const QuizResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { answers, quizId } = location.state || { answers: [], quizId: null };
    
    // Hitung skor quiz saat ini (maksimal 100)
    const calculateQuizScore = () => {
        const totalQuestions = answers.length;
        const totalPoints = answers.reduce((sum, answer) => sum + answer.score, 0);
        // Normalisasi skor ke skala 100
        return Math.round((totalPoints / (totalQuestions * 10)) * 100);
    };
  
    useEffect(() => {
      if (answers.length > 0 && quizId) {
        // Save completed quiz to cookies
        const completedQuizzes = JSON.parse(Cookies.get('completedQuizzes') || '[]');
        if (!completedQuizzes.includes(Number(quizId))) {
          completedQuizzes.push(Number(quizId));
          Cookies.set('completedQuizzes', JSON.stringify(completedQuizzes), { expires: 365 });
        }

        // Simpan skor quiz saat ini
        const quizScores = JSON.parse(Cookies.get('quizScores') || '{}');
        quizScores[quizId] = calculateQuizScore();
        Cookies.set('quizScores', JSON.stringify(quizScores), { expires: 365 });

        // Hitung rata-rata dari semua quiz yang telah dikerjakan
        const scores = Object.values(quizScores);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        Cookies.set('totalPoints', averageScore.toString(), { expires: 365 });
      }
    }, [answers, quizId]);

    const handleFinish = () => {
      navigate('/quiz');
    };

    const quizScore = calculateQuizScore();

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
          <p className="text-lg font-bold mb-2">
            Skor Quiz Ini: {quizScore} / 100
          </p>
          <p className="text-sm text-gray-600 mb-4">
            (Skor dihitung berdasarkan akurasi jawaban Anda)
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