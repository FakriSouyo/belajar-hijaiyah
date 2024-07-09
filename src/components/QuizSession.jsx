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

          navigate(`/quiz/${quizId}/result`, { state: { answers: [...answers, { letter: quizData[quizId][currentQuestion].letter, score: score }] } });
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
        return <div className="text-center mt-8">Loading model...</div>;
    }

    if (!quizData[quizId] || !quizData[quizId][currentQuestion]) {
        return <div className="text-center mt-8">Quiz tidak ditemukan</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Quiz {quizId}: Pertanyaan {currentQuestion + 1}</h1>
            <p className="mb-4">{quizData[quizId][currentQuestion].prompt}</p>
            <SimpleCanvas ref={canvasRef} width={280} height={280} lineColor="white" backgroundColor="black" />
            <div className="mt-4">
                <button onClick={clearCanvas} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">Clear</button>
                <button onClick={handleSubmit} className="bg-gray-800 text-white px-4 py-2 rounded">Submit</button>
            </div>
            <div className="mt-4">
                <p>Progress: {currentQuestion + 1} / {quizData[quizId].length}</p>
            </div>
        </div>
    );
};

export default QuizSession;