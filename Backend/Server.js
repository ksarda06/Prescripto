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
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
  'https://prescripto-a5to.onrender.com',
  'https://prescripto-admin-3uzo.onrender.com'
  ,'http://localhost:5173',
  'https://appointmate-a067.onrender.com',
  'https://appointmate-admin.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.options('*',cors())
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.get('/',(req,res)=>{
   res.send('API WORKING Great')
})
app.listen(port,()=>{
    console.log("Server started",port)
})
