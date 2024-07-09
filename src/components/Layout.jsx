// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;