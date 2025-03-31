import React from 'react'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import ResetPassword from './pages/ResetPassword'
import {Route,Routes} from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import EmailVerify from './pages/EmailVerify'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/doctors/:speciality" element={<Doctors/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/my-profile" element={<MyProfile/>}/>
        <Route path="/my-appointment" element={<MyAppointment/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path="/appointment/:docId" element={<Appointment/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
