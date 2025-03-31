import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
const EmailVerify = () => {
  axios.defaults.withCredentials=true
  const {backendUrl,loadUserProfileData,token,userData}=useContext(AppContext)
  const navigate=useNavigate()
  const inputRefs=React.useRef([])
  const handleInput=(e,index)=>{
    if(e.target.value.length>0 && index<inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }
  const handleKeyDown=(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
      inputRefs.current[index-1].focus();
    }
  }
  const  handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text')
    const pasteArray=paste.split('')
    pasteArray.forEach((char,index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char;
        }
    })
  }
  const onSubmitHandler=async(e)=>{
    try{
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value)
      const otp=otpArray.join('')
      const {data}=await axios.post(backendUrl+'/api/user/verify-account',{otp})
      if(data.success){
        toast.success(data.message)
        loadUserProfileData()
        navigate('/')
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
       toast.error(data.message)
    }
  }
  useEffect(()=>{
      token && userData && userData.isAccountVerified && navigate('/')        
  },[token,userData])
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <form onSubmit={onSubmitHandler}className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
           {Array(6).fill(0).map((item,index)=>(
            <input type="text" maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rouded' ref={e=>inputRefs.current[index]=e} onInput={(e)=>handleInput(e,index)} onKeyDown={(e)=>handleKeyDown(e,index)}/> 
           ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Verify Email</button>
      </form>
        
    </div>
  )
}

export default EmailVerify
