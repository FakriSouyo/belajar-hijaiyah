import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ModelInfo = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Perbandingan Akurasi Model',
      },
    },
  };

  const lossOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Perbandingan Loss Model',
      },
    },
  };

  const labels = ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5', 'Epoch 6', 'Epoch 7', 'Epoch 8', 'Epoch 9', 'Epoch 10','Epoch 11', 'Epoch 12', 'Epoch 13', 'Epoch 14', 'Epoch 15', 'Epoch 16', 'Epoch 17', 'Epoch 18', 'Epoch 19', 'Epoch 20'];

  const accuracyData = {
    labels,
    datasets: [
      {
        label: 'Custom Model Akurasi',
        data: [0.964, 0.951, 0.971, 0.972, 0.970, 0.968, 0.965, 0.971, 0.970, 0.974, 0.969, 0.972, 0.970, 0.969, 0.969, 0.973, 0.973, 0.971, 0.975, 0.972],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'AlexNet Akurasi',
        data: [0.524, 0.759, 0.836, 0.874, 0.884, 0.915, 0.926, 0.933, 0.923, 0.935, 0.916, 0.937, 0.926, 0.933, 0.940, 0.944, 0.912, 0.930, 0.941, 0.927],        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'LeNet Akurasi',
        data: [0.676, 0.788, 0.833, 0.846, 0.870, 0.878, 0.877, 0.877, 0.900, 0.904, 0.910, 0.915, 0.905, 0.905, 0.916, 0.906, 0.912, 0.909, 0.919, 0.918],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const lossData = {
    labels,
    datasets: [
      {
        label: 'Custom Model Loss',
        data: [0.136, 0.188, 0.131, 0.120, 0.140, 0.147, 0.150, 0.137, 0.161, 0.125, 0.131, 0.153, 0.140, 0.146, 0.166, 0.147, 0.123, 0.134, 0.129, 0.144],        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'AlexNet Loss',
        data: [1.293, 0.618, 0.508, 0.425, 0.407, 0.297, 0.257, 0.281, 0.338, 0.301, 0.441, 0.275, 0.372, 0.354, 0.317, 0.317, 0.553, 0.441, 0.329, 0.413],        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'LeNet Loss',
        data: [0.932, 0.654, 0.513, 0.457, 0.415, 0.368, 0.395, 0.401, 0.357, 0.314, 0.312, 0.314, 0.391, 0.351, 0.364, 0.346, 0.349, 0.364, 0.340, 0.351],        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Tentang Model</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Perbandingan Model</h2>
        <Line options={options} data={accuracyData} />
      </div>

      <div className="mb-8">
        <Line options={lossOptions} data={lossData} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold mb-2">Custom Model</h3>
          <p>Model kustom yang dirancang khusus untuk tugas ini. Menyeimbangkan kinerja dan efisiensi.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">AlexNet</h3>
          <p>Model CNN mendalam yang memenangkan ImageNet challenge 2012. Cocok untuk klasifikasi gambar kompleks.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">LeNet</h3>
          <p>Arsitektur CNN awal yang efisien. Ideal untuk tugas klasifikasi gambar sederhana.</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Perbandingan Kinerja</h2>
        <table className="w-full text-center border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Model</th>
              <th className="border border-gray-300 p-2">Akurasi</th>
              <th className="border border-gray-300 p-2">Loss</th>
              <th className="border border-gray-300 p-2">Waktu Pelatihan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Custom Model</td>
              <td className="border border-gray-300 p-2">97%</td>
              <td className="border border-gray-300 p-2">0.14</td>
              <td className="border border-gray-300 p-2">20 menit</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">AlexNet</td>
              <td className="border border-gray-300 p-2">92%</td>
              <td className="border border-gray-300 p-2">0.41</td>
              <td className="border border-gray-300 p-2">18 menit</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">LeNet</td>
              <td className="border border-gray-300 p-2">91%</td>
              <td className="border border-gray-300 p-2">0.35</td>
              <td className="border border-gray-300 p-2">18 menit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8 mt-8">
        <h3 className="text-2xl font-semibold mb-4">Source Dataset</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-700 mb-4">
            Dataset ini terdiri dari 16.800 karakter yang ditulis oleh 60 partisipan dengan rentang usia 19-40 tahun, 
            di mana 90% partisipan adalah pengguna tangan kanan. Setiap partisipan menulis setiap karakter 
            (dari 'alef' hingga 'yeh') sebanyak sepuluh kali pada dua formulir berbeda.
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Total karakter: 16.800</li>
            <li>Jumlah partisipan: 60</li>
            <li>Rentang usia: 19-40 tahun</li>
            <li>Resolusi pemindaian: 300 dpi</li>
            <li>Set pelatihan: 13.440 karakter (480 gambar per kelas)</li>
            <li>Set pengujian: 3.360 karakter (120 gambar per kelas)</li>
          </ul>
          <p className="text-gray-700 mb-4">
            Formulir dipindai dengan resolusi 300 dpi. Setiap blok disegmentasi secara otomatis menggunakan 
            Matlab 2016a untuk menentukan koordinat masing-masing blok. Database dipartisi menjadi dua set: 
            set pelatihan dan set pengujian. Penulis dalam set pelatihan dan set pengujian adalah eksklusif. 
            Urutan penulis dalam set pengujian diacak untuk memastikan variabilitas set pengujian.
          </p>
          <p className="font-semibold">
            Sumber: <a href="https://www.kaggle.com/datasets/mloey1/ahcd1" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Arabic Handwritten Characters Dataset (AHCD)</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;