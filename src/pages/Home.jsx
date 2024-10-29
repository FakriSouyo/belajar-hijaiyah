import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleBelajarClick = () => {
    navigate('/belajar');
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img 
          src="hero.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl font-bold mb-4">Belajar Huruf Hijaiyah</h1>
        <p className="text-xl mb-8">Mari Belajar Huruf-Huruf Hijaiyah</p>
        <button 
          onClick={handleBelajarClick}
          className="bg-gray-800 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-700 transition duration-300"
        >
          Belajar
        </button>
      </div>
    </div>
  );
};

export default Home;