import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'

const Navbar = () => {
  const { navigate, token } = useAppContext()

  return (
    <div className='flex justify-between items-center py-3 mx-8 sm:mx-20 xl:mx-32 '>
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="SoulScribe Logo"
        className='w-32 sm:w-44 cursor-pointer'
      />
      <button
        onClick={() => navigate('/admin')}
        className='flex items-center gap-2 rounded-full text-sm 
        cursor-pointer bg-primary text-white px-10 py-2.5'
      >
        {token ? 'My Dashboard' : 'Start Writing'}
        <img src={assets.arrow} className='w-3' alt="Arrow icon" />
      </button>
    </div>
  )
}

export default Navbar