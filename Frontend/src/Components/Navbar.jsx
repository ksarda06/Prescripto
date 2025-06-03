import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useState } from 'react'
import {NavLink,useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
const Navbar = () => {
    const Navigate=useNavigate();
    const [showMenu,setShowMenu]=useState(false);
    const {backendUrl,token,setToken,userData}=useContext(AppContext)
    const logout=()=>{
          setToken('')
          Navigate('./')
          localStorage.removeItem('token')
    }
    const sendVerificationOtp=async()=>{
        try{
            axios.defaults.withCredentials=true;
            const {data}=await axios.post(backendUrl+'/api/user/send-verify-otp')
            console.log(data)
            if(data.success){
                Navigate('/email-verify')
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            toast.error(err.message)
        }
    }
  return (
    <div className="flex items-center justify-between text-sm py-5 mb-5 border-b-gray-40">
      <img onClick={()=>Navigate('./')}className="w-44 cursor-pointer"src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to="/">
            <li className='py-1'>
                HOME
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to="/doctors">
            <li className='py-1'> 
                ALL DOCTORS
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to="/about">
            <li className='py-1'>
                ABOUT
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
        <NavLink to="/contact">
            <li className='py-1'>
                CONTACT
            </li>
            <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
        </NavLink>
      </ul>
      <div className='flex item-center gap-4'>
        {
            token && userData ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                <img className='w-8 rounded-full'src={userData.image}></img>
                <img className='w-2.5'src={assets.dropdown_icon} />                
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                    <p onClick={()=>Navigate('./my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                    {!userData.isAccountVerified && <p onClick={sendVerificationOtp} className='hover:text-black cursor-pointer'>Verify Email</p>}
                    <p onClick={()=>Navigate('./my-appointment')} className='hover:text-black cursor-pointer'>My Appointment</p>
                    <p onClick={()=>logout()}className='hover:text-black cursor-pointer'>Logout</p>
                </div>
            </div>
            </div>
            :
        <button onClick={()=>Navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light  md-block'>Create Account</button>
        }    
        <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
        <div className={`${showMenu ? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
            <div className='flex items-center justify-between px-5 py-6'>
                <img className='w-36'src={assets.logo}/>
                <img className='w-7'onClick={()=>setShowMenu(false)}src={assets.cross_icon} alt="" />
            </div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                <NavLink className='px-4 py-2 rounded inline-block'onClick={()=>setShowMenu(false)}to='/'><p>Home</p></NavLink >
                <NavLink className='px-4 py-2 rounded inline-block'onClick={()=>setShowMenu(false)}to='/doctors'><p>ALL Doctors</p></NavLink>
                <NavLink className='px-4 py-2 rounded inline-block'onClick={()=>setShowMenu(false)}to='/about'><p>About</p></NavLink>
                <NavLink className='px-4 py-2 rounded inline-block'onClick={()=>setShowMenu(false)}to='/contact'><p>Contact</p></NavLink>
            </ul>
        </div>
        </div>
    </div>
  )
}

export default Navbar
