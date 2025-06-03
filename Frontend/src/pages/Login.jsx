import  React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {  useNavigate } from 'react-router-dom'
const Login = () => {
  const {backendUrl,token,setToken,loadUserProfileData,userData,setUserData}=useContext(AppContext)
  const navigate=useNavigate()
  const [state,setState]=useState('Sign Up')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const onSubmitHandler=async(event)=>{
    event.preventDefault()
    try{
       if(state==='Sign Up'){
        const {data}=await axios.post(backendUrl+'/api/user/register',{name,email,password})
        //console.log(data)
        if(data.success){
          console.log("success");
          localStorage.setItem(token,data.token)
          setToken(data.token)
          toast.success("Account created successfully")
        }
        else{
          toast.error(data.message)
        }
       }
       else{
        const {data}=await axios.post(backendUrl+'/api/user/login',{email,password})
        console.log(data)
        if(data.success){
          localStorage.setItem("token",data.token)
          setToken(data.token)
          toast.success("Login Successfull")
        }
        else{
          console.log(data.message)
          toast.error("H1")
        }
      }
    }
    catch(err){
      console.log(err)
      toast.error("H2")
    }
  }
  useEffect(()=>{
    if(token){
        console.log("Use effect ")
        loadUserProfileData()
        setUserData(True)
        navigate('/')
    }
    else{
        setUserData(false)
    }
  },[token])
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-zinc-600 text-sm shadow-lg'>
        <p>{state==='Sign Up'?"Create Account":"Login"}</p>
        <p>please {state==='Sign Up'?"sign up":"log in"} to book appointment</p>
        {
          state==="Sign Up" && <div className='w-full'>
          <p>Full Name</p>
          <input type="text" className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e)=>setName(e.target.value)} value={name}/>
          </div>
        }
        <div className='w-full'>
          <p>Email</p>
          <input type="text" className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input type="text" className='border border-zinc-300 rounded w-full p-2 mt-1' onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </div>
        <p onClick={()=>navigate('/reset-password')}>Forgot Password?</p>
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state ==='Sign Up'?'Create Account':'Login'}</button>
        {
          state==='Sign Up'?<p>Already have an account?<span onClick={()=>setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>:<p>Create an new account?<span onClick={()=>setState('Sign Up')} className='text-primary underline cursor-pointer'>click here</span></p>
        }
        </div>
    </form>
  )
}

export default Login
 
