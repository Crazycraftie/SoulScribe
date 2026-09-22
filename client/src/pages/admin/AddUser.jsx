import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddUser = () => {
  const { axios } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const { data } = await axios.post('/api/admin/register', { name, email, password });
      if (data.success) {
        toast.success('User added successfully');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='flex-1 pt-5 px-5 sm:pl-16 bg-blue-50/50'>
      <h1 className='text-xl font-semibold text-gray-700'>Add an Admin User</h1>

      <form onSubmit={onSubmitHandler} className='mt-4 bg-white w-full max-w-md p-6 shadow rounded'>
        <div className='flex flex-col'>
          <label className='text-sm text-gray-600'>Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder='Full name'
            className='border-b-2 border-gray-300 p-2 outline-none mb-6'
          />
        </div>

        <div className='flex flex-col'>
          <label className='text-sm text-gray-600'>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder='name@example.com'
            className='border-b-2 border-gray-300 p-2 outline-none mb-6'
          />
        </div>

        <div className='flex flex-col'>
          <label className='text-sm text-gray-600'>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            minLength={6}
            placeholder='Choose a password'
            className='border-b-2 border-gray-300 p-2 outline-none mb-6'
          />
        </div>

        <button
          disabled={isAdding}
          type='submit'
          className='w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all'
        >
          {isAdding ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
