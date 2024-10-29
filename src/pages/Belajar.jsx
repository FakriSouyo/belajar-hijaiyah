import React, { useRef, useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import SimpleCanvas from '../components/SimpleCanvas'; 
import { Link } from 'react-router-dom'; 

const arabicCharacters = [
  'alif', 'beh', 'teh', 'theh', 'jeem', 'hah', 'khah', 'dal', 'thal',
  'reh', 'zain', 'seen', 'sheen', 'sad', 'dad', 'tah', 'zah', 'ain',
  'ghain', 'feh', 'qaf', 'kaf', 'lam', 'meem', 'noon', 'heh', 'waw', 'yeh'
];

const getRandomCharacter = () => {
  const randomIndex = Math.floor(Math.random() * arabicCharacters.length);
  return { char: arabicCharacters[randomIndex], index: randomIndex };
};

const modelPaths = {
  'Custom Model': '/models_tfjs_asli/model.json',
  'AlexNet': '/models_alexnet_tfjs/model.json',
  'LeNet': '/models_lenet_tfjs/model.json'
};

const Belajar = () => {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('');
  const [model, setModel] = useState(null);
  const [targetChar, setTargetChar] = useState(getRandomCharacter());
  const [selectedModel, setSelectedModel] = useState('Custom Model');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        const loadedModel = await tf.loadLayersModel(modelPaths[selectedModel]);
        console.log('Model loaded successfully');
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load the model:', error);
      }
      setIsLoading(false);
    };
    loadModel();
  }, [selectedModel]);

  const preprocessImage = (imageData) => {
    return tf.tidy(() => {
      const grayscale = tf.browser.fromPixels(imageData, 1);
      const resized = tf.image.resizeBilinear(grayscale, [32, 32]);
      const normalized = resized.toFloat().div(tf.scalar(255));
      return normalized.expandDims(0);
    });
  };

  const predict = async () => {
    if (!model || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const tensor = preprocessImage(imageData);

    try {
      const predictions = await model.predict(tensor).data();
      const maxPrediction = Math.max(...predictions);
      const predictedIndex = predictions.indexOf(maxPrediction);
      const predictedChar = arabicCharacters[predictedIndex];

      if (predictedIndex === targetChar.index && Math.floor(maxPrediction * 10) >= 3) {
        setPrediction(`✨ Hebat! Nilai kamu ${Math.floor(maxPrediction * 10)}/10`);
      } else {
        setPrediction('❌ Kurang tepat, coba lagi!');
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction('');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Belajar Menulis Hijaiyah</h1>
          <p className="text-gray-600 mt-2">
            Praktik menulis huruf hijaiyah dan dapatkan feedback langsung
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Target Character */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Tuliskan Huruf: <span className="text-3xl font-bold">{targetChar.char}</span>
            </h2>
            <p className="text-gray-600">
              Gambar huruf menggunakan mouse atau touch screen
            </p>
          </div>

          {/* Canvas and Prediction Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Canvas */}
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
            </div>

            {/* Prediction Display */}
            <div className="flex flex-col justify-center">
              <div className="bg-gray-50 rounded-lg p-6 text-center h-full flex items-center justify-center">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Hasil Prediksi</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {prediction || 'Tulis huruf dan klik "Periksa"'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
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
              onClick={predict}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Periksa
            </button>
            <button 
              onClick={() => {
                clearCanvas();
                setTargetChar(getRandomCharacter());
              }}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Huruf Berikutnya
            </button>
          </div>

          {/* Model Selection */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <label className="text-gray-700 font-semibold">Pilih Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="Custom Model">Custom Model</option>
                <option value="AlexNet">AlexNet</option>
                <option value="LeNet">LeNet</option>
              </select>
              <Link 
                to="/model-info"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Belajar;
