import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  let lastSubmitTime = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date().getTime();
    if (now - lastSubmitTime < 30000) { // 30 seconds throttle
      swal({
        title: "Harap Tunggu",
        text: "Anda perlu menunggu 30 detik antara percobaan pendaftaran.",
        icon: "warning",
        button: {
          text: "OK",
          className: "swal-button-black",
        },
        className: "swal-black-icon",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Menampilkan alert konfirmasi email
      swal({
        title: "Pendaftaran Berhasil",
        text: "Silakan periksa email Anda untuk mengonfirmasi pendaftaran.",
        icon: "success",
        button: {
          text: "OK",
          className: "swal-button-black",
        },
        className: "swal-black-icon",
      });

      navigate('/login'); // Redirect ke halaman login setelah signup berhasil
      lastSubmitTime = new Date().getTime();
    } catch (error) {
      console.error("Error during signup:", error);
      swal({
        title: "Pendaftaran Gagal",
        text: "Harap Menunggu Beberapa Jam",
        icon: "error",
        button: {
          text: "OK",
          className: "swal-button-black",
        },
        className: "swal-black-icon",
      });
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <button
            type="submit"
            className="w-full font-bold bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-transparent border border-black hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
            disabled={loading}
            >
            {loading ? 'Loading...' : 'Register'}
            </button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
        <Link to="/login" className="text-black-600 hover:underline">Login?</Link>
        </div>
        </div>
        
    );
    };

    export default SignUp;
