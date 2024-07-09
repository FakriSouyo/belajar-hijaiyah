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

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(modelPaths[selectedModel]);
        console.log('Model loaded successfully');
        console.log('Model summary:', loadedModel.summary());
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load the model:', error);
      }
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
    console.log('Preprocessed tensor shape:', tensor.shape);
    console.log('Tensor values:', await tensor.array());

    try {
      const predictions = await model.predict(tensor).data();
      console.log('Raw predictions:', predictions);

      const maxPrediction = Math.max(...predictions);
      const predictedIndex = predictions.indexOf(maxPrediction);
      const predictedChar = arabicCharacters[predictedIndex];

      console.log('Predicted index:', predictedIndex);
      console.log('Predicted character:', predictedChar);
      console.log('Confidence:', maxPrediction);

      if (predictedIndex === targetChar.index && Math.floor(maxPrediction * 10) >= 3) {
        setPrediction(`Selamat! Kamu dapat Nilai ${Math.floor(maxPrediction * 10)} dari 10`);
      } else {
        setPrediction('Kurang benar, Coba lagi!');
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

  const handleNext = () => {
    clearCanvas();
    setTargetChar(getRandomCharacter());
    setPrediction('');
  };

  const handleCheck = () => {
    predict();
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    clearCanvas();
    setTargetChar(getRandomCharacter());
    setPrediction('');
  };

  return (
    <div className="container mx-auto p-4">
      <main className="mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Gambarkan Huruf: {targetChar.char}</h1>
        <div className="flex justify-center space-x-4 mb-8">
          <SimpleCanvas
            ref={canvasRef}
            width={280}
            height={280}
            lineColor="white"
            backgroundColor="black"
          />
          <div className="bg-gray-200 w-64 h-65 flex items-center justify-center border border-gray-300 p-4 rounded-lg">
            {prediction ? (
              <p className="text-3xl">{prediction}</p>
            ) : (
              <h2 className="text-xl font-bold mb-2">Prediction:</h2>
            )}
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={clearCanvas} className="bg-black text-white px-6 py-2 rounded">Clear</button>
          <button onClick={handleNext} className="bg-black text-white px-6 py-2 rounded">Selanjutnya</button>
          <button onClick={handleCheck} className="bg-black text-white px-6 py-2 rounded">Cek</button>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <label htmlFor="modelSelect" className="block text-lg font-medium text-gray-700 mr-2">
            Pilih Model:
          </label>
          <div className="relative inline-block w-64 text-gray-700">
            <select
              id="modelSelect"
              value={selectedModel}
              onChange={handleModelChange}
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              style={{
                backgroundColor: selectedModel === 'Custom Model' ? 'black' : 
                                 selectedModel === 'AlexNet' ? 'black' :
                                 selectedModel === 'LeNet' ? 'black' : 'white',
                color: selectedModel ? 'white' : 'black'
              }}
            >
              <option value="Custom Model">Custom Model</option>
              <option value="AlexNet">AlexNet</option>
              <option value="LeNet">LeNet</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M7 10l5 5 5-5H7z"/>
              </svg>
            </div>
          </div>
          <Link to="/model-info" className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Belajar;
