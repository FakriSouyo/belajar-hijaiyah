import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import swal from 'sweetalert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      swal({
        title: "Login Berhasil",
        text: "Anda berhasil masuk ke akun Anda.",
        icon: "success",
        button: {
          text: "OK",
          className: "swal-button-black",
        },
        className: "swal-black-icon",
      });

      navigate('/');
    } catch (error) {
      console.error("Detailed error:", error);
      if (error instanceof Error && error.message.includes('network')) {
        swal({
          title: "Koneksi Error",
          text: "Gagal terhubung ke server. Mohon periksa koneksi internet Anda atau coba lagi nanti.",
          icon: "error",
          button: {
            text: "OK",
            className: "swal-button-black",
          },
          className: "swal-black-icon",
        });
      } else {
        swal({
          title: "Login Gagal",
          text: error.message || "Email atau password salah",
          icon: "error",
          button: {
            text: "OK",
            className: "swal-button-black",
          },
          className: "swal-black-icon",
        });
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
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
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        {/* <Link to="/forgot-password" className="text-black-600 hover:underline">Forget password?</Link> */}
        <Link to="/signup" className="text-black-600 hover:underline">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
