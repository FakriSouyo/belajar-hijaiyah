import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, loading: userLoading } = useUser();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berhasil di perbarui!',
        icon: 'success',
        confirmButtonColor: '#000000'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error updating profile: ' + error.message,
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    console.log('Feedback:', { rating, message: feedbackMessage });
    setShowModal(false);
    setRating(0);
    setFeedbackMessage('');
    
    Swal.fire({
      title: 'Terima Kasih!',
      text: 'atas umpan balik',
      icon: 'success',
      confirmButtonColor: '#000000'
    });
  };

  const StarRating = ({ rating, onRating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => onRating(star)}
            className={`cursor-pointer text-3xl ${
              star <= rating ? 'text-black' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (userLoading || loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <h2 className="text-center text-white text-xl font-semibold">Loading...</h2>
        <p className="w-1/3 text-center text-white">mungkin butuh beberapa detik</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <form onSubmit={updateProfile} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Perbarui Profile'}
          </button>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Umpan Balik
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Kritik dan saran</h2>
            <div className="mb-4">
              <StarRating rating={rating} onRating={setRating} />
            </div>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="pesan"
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;