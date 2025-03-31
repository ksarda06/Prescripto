import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoutes.js'
const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()
const allowedOrigins=['https://prescripto-a5to.onrender.com/]
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedOrigins,credentials:true}))
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
   res.send('API WORKING Great')
})
app.listen(port,()=>{
    console.log("Server started",port)
})
