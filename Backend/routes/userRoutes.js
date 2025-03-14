import express from 'express'
import {cancelAppointment,listAppointment,registerUser,loginUser, getProfile,updateProfile,bookAppointment} from '../controller/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'
const userRouter=express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/my-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointment',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)

export default userRouter