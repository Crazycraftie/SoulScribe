import React from 'react';
import { Outlet } from 'react-router-dom';
import { assets } from '../../assets/assets';
import Sidebar from '../../components/admin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization']; // Safer removal
    setToken(null);
    navigate('/');
  };

  return (
    <>
      {/* Top Navbar */}
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200 bg-white shadow-sm z-10'>
        <img
          src={assets.logo}
          alt="SoulScribe Logo"
          className='w-32 sm:w-40 cursor-pointer'
          onClick={() => navigate('/')}
        />
        <button
          onClick={logout}
          className='text-sm px-6 py-2 bg-primary text-white rounded-full cursor-pointer hover:opacity-90 transition-all'
        >
          Log out
        </button>
      </div>

      {/* Sidebar & Page Content */}
      <div className='flex h-[calc(100vh-70px)] bg-blue-50/50'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;