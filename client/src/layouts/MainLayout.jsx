import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-64px)] flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
