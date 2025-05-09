import express from 'express'
import {isAuthenticated,logout,cancelAppointment,listAppointment,registerUser,loginUser, getProfile,updateProfile,bookAppointment,paymentRazorpay,verifyRazorpay, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword} from '../controller/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'
const userRouter=express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/logout',logout)
userRouter.post('/send-verify-otp',authUser,sendVerifyOtp)
userRouter.post('/verify-account',authUser,verifyEmail)
userRouter.get('/is-auth',authUser,isAuthenticated)
userRouter.post('/send-reset-otp',sendResetOtp)
userRouter.post('/reset-password',resetPassword)
userRouter.get('/my-profile',getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointment',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
export default userRouter
