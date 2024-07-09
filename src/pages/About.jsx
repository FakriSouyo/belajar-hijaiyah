import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Le'yah</h1>
      <h2 className="text-2xl mb-8">Learning Hijaiyah</h2>
      
      <div className="mb-8">
        <p className="text-gray-700">
        Lea'yah Learning Hijaiyah, platform inovatif untuk mempelajari huruf hijaiyah. Dikembangkan oleh tim dari Universitas Muhammadiyah Yogyakarta, Lea'yah menggunakan model Convolutional Neural Network (CNN) untuk memberikan pengalaman belajar yang interaktif dan efektif. Dengan metode pembelajaran yang terintegrasi teknologi terkini, kami bertujuan untuk membantu pengguna dari berbagai usia dan latar belakang untuk memahami dan menguasai huruf hijaiyah dengan lebih mudah dan menyenangkan.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Team Pengembang</h3>
        <p className="mb-2">Universitas Muhammadiyah Yogyakarta</p>
        
        <div className="grid gap-4">
          {[
            { name: 'Febri Kurnia Sandi', role: 'Team pengembang' },
            { name: 'Cahya Damarjati, S.T. M. Eng., Ph.D.', role: 'Dosen pembimbing 1' },
            { name: 'Asroni', role: 'Dosen pembimbing 2' },
            { name: 'Fakhri Abdillah', role: 'Team pengembang' },
          ].map((member, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Ada Pertanyaan?</h3>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Nama</label>
            <input type="text" id="name" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="email" id="email" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2">Pesan</label>
            <textarea id="message" rows="4" className="w-full p-2 border rounded"></textarea>
          </div>
          <button type="submit" className="bg-black text-white py-2 px-4 rounded">Kirim</button>
        </form>
      </div>
    </div>
  );
};

export default About;