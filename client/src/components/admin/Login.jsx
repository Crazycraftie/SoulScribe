import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const Login = () => {
    const {axios,setToken,fetchBlogs}= useAppContext();
    const [mode,setMode]=useState('login') // 'login' | 'signup'
    const[name,setName]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const endpoint = mode==='login' ? '/api/admin/login' : '/api/admin/register'
            const payload = mode==='login' ? {email,password} : {name,email,password}
            const {data}=await axios.post(endpoint,payload)

            if(data.success){
                setToken(data.token)
                localStorage.setItem('token',data.token)
                axios.defaults.headers.common['Authorization']=data.token;
                fetchBlogs();
            }else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const toggleMode=()=>{
        setMode(mode==='login' ? 'signup' : 'login')
        setName('')
        setEmail('')
        setPassword('')
    }

  return (
    <div>
        <div className='flex items-center justify-center h-screen'>
        <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30
        shadow-xl shadow-primary/15 rounded-lg'>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-full py-6 text-center'>
                    <h1 className='text-3xl font-bold'><span className='text-primary'>
                        Admin</span> {mode==='login' ? 'Login' : 'Sign Up'}</h1>
                        <p className='font-light'>
                          {mode==='login'
                            ? 'Enter your credentials to access the admin panel'
                            : 'Create a publisher account to start writing'}
                        </p>
                </div>

                <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
                    {mode==='signup' && (
                      <div className='flex flex-col'>
                          <label>Name</label>
                          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='your name'
                          className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
                      </div>
                    )}
                    <div className='flex flex-col'>
                        <label>Email</label>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" required placeholder='your email id'
                        className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
                    </div>
                    <div className='flex flex-col'>
                        <label>Password</label>
                        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" required minLength={mode==='signup' ? 6 : undefined} placeholder='your password'
                        className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
                    </div>
                    <button type='submit' className='w-full py-3 font-medium bg-primary
                    text-white rounded cursor-pointer hover:bg-primary/90
                    transition-all'>{mode==='login' ? 'Login' : 'Sign Up'}</button>
                </form>

                <button onClick={toggleMode} type='button' className='mt-4 text-sm text-primary hover:underline cursor-pointer'>
                    {mode==='login' ? "New publisher? Sign up" : 'Already have an account? Log in'}
                </button>
            </div>
        </div>
        </div>

    </div>
  )
}

export default Login
