import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleCanvas from '../components/SimpleCanvas';
import * as tf from '@tensorflow/tfjs';

const QuizSession = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [model, setModel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);

    const quizData = {
        1: [
            { letter: 'alif', prompt: 'Gambar huruf Alif' },
            { letter: 'beh', prompt: 'Gambar huruf Beh' },
            { letter: 'teh', prompt: 'Gambar huruf Teh' },
            { letter: 'theh', prompt: 'Gambar huruf Theh' },
            { letter: 'jeem', prompt: 'Gambar huruf Jeem' },
        ],
        2: [
            { letter: 'hah', prompt: 'Gambar huruf Hah' },
            { letter: 'khah', prompt: 'Gambar huruf Khah' },
            { letter: 'dal', prompt: 'Gambar huruf Dal' },
            { letter: 'thal', prompt: 'Gambar huruf Thal' },
            { letter: 'reh', prompt: 'Gambar huruf Reh' },
        ],
        3: [
            { letter: 'zain', prompt: 'Gambar huruf Zain' },
            { letter: 'seen', prompt: 'Gambar huruf Seen' },
            { letter: 'sheen', prompt: 'Gambar huruf Sheen' },
            { letter: 'sad', prompt: 'Gambar huruf Sad' },
            { letter: 'dad', prompt: 'Gambar huruf Dad' },
            { letter: 'tah', prompt: 'Gambar huruf Tah' },
        ],
        4: [
            { letter: 'zah', prompt: 'Gambar huruf Zah' },
            { letter: 'ain', prompt: 'Gambar huruf Ain' },
            { letter: 'ghain', prompt: 'Gambar huruf Ghain' },
            { letter: 'feh', prompt: 'Gambar huruf Feh' },
            { letter: 'qaf', prompt: 'Gambar huruf Qaf' },
            { letter: 'kaf', prompt: 'Gambar huruf Kaf' },
        ],
        5: [
            { letter: 'lam', prompt: 'Gambar huruf Lam' },
            { letter: 'meem', prompt: 'Gambar huruf Meem' },
            { letter: 'noon', prompt: 'Gambar huruf Noon' },
            { letter: 'heh', prompt: 'Gambar huruf Heh' },
            { letter: 'waw', prompt: 'Gambar huruf Waw' },
            { letter: 'yeh', prompt: 'Gambar huruf Yeh' },
        ],
    };

    useEffect(() => {
        loadModel();
    }, []);

    const loadModel = async () => {
        try {
            const loadedModel = await tf.loadLayersModel('/models_tfjs_asli/model.json');
            setModel(loadedModel);
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading model:', error);
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!model || !canvasRef.current) return;
        

        const canvas = canvasRef.current;
        const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        const tensor = preprocessImage(imageData);

        const prediction = await model.predict(tensor).data();
        const maxPrediction = Math.max(...prediction);
        const predictedIndex = prediction.indexOf(maxPrediction);

        const letterMap = [
            'alif', 'beh', 'teh', 'theh', 'jeem', 'hah', 'khah', 'dal', 'thal',
            'reh', 'zain', 'seen', 'sheen', 'sad', 'dad', 'tah', 'zah', 'ain',
            'ghain', 'feh', 'qaf', 'kaf', 'lam', 'meem', 'noon', 'heh', 'waw', 'yeh'
        ];
        const predictedLetter = letterMap[predictedIndex];

        const score = predictedLetter === quizData[quizId][currentQuestion].letter ? Math.floor(maxPrediction * 10) : 0;

        setAnswers([...answers, { letter: quizData[quizId][currentQuestion].letter, score: score }]);

        if (currentQuestion < quizData[quizId].length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          clearCanvas();
      } else {
          // Tandai quiz sebagai selesai
          const completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
          if (!completedQuizzes.includes(Number(quizId))) {
              completedQuizzes.push(Number(quizId));
              localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
          }

          navigate(`/quiz/${quizId}/result`, { 
              state: { 
                  answers: [...answers, { letter: quizData[quizId][currentQuestion].letter, score: score }],
                  quizId: quizId 
              } 
          });
      }
  };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const preprocessImage = (imageData) => {
        return tf.tidy(() => {
            const grayscale = tf.browser.fromPixels(imageData, 1);
            const resized = tf.image.resizeBilinear(grayscale, [32, 32]);
            const normalized = resized.toFloat().div(tf.scalar(255));
            return normalized.expandDims(0);
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-xl font-semibold">Loading model...</p>
                </div>
            </div>
        );
    }

    if (!quizData[quizId] || !quizData[quizId][currentQuestion]) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold text-red-600">Quiz tidak ditemukan</p>
                    <button 
                        onClick={() => navigate('/quiz')}
                        className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Kembali ke Daftar Quiz
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Quiz {quizId}</h1>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-gray-800 h-2.5 rounded-full transition-all duration-300" 
                                style={{ width: `${(currentQuestion + 1) / quizData[quizId].length * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Pertanyaan {currentQuestion + 1} dari {quizData[quizId].length}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Question */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            {quizData[quizId][currentQuestion].prompt}
                        </h2>
                        <p className="text-gray-600">
                            Gambar huruf menggunakan mouse atau touch screen
                        </p>
                    </div>

                    {/* Canvas Section */}
                    <div className="flex flex-col items-center">
                        <div className="border-4 border-gray-200 rounded-lg p-2 mb-4">
                            <SimpleCanvas 
                                ref={canvasRef} 
                                width={280} 
                                height={280} 
                                lineColor="white" 
                                backgroundColor="black" 
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 mb-6">
                            <button 
                                onClick={clearCanvas}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Hapus
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Submit
                            </button>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips:</h3>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>Gambar huruf dengan jelas dan lengkap</li>
                            <li>Gunakan seluruh area kanvas yang tersedia</li>
                            <li>Jika melakukan kesalahan, gunakan tombol Hapus</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizSession;