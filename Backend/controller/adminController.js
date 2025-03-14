import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorsModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
const addDoctor=async(req,res)=>{
    try{
       const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
       const imageFile=req.file;
       if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
        return res.json({success:false,message:"Missing Details"})
       }
       if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid email"})
       }
       if(password.length<8){
        return res.json({success:false,message:"Please enter a strong password"})
       }
       const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hash(password,salt)
       const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
       const imageUrl=imageUpload.secure_url
       const doctorData={
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
       }
       const newDoctor=new doctorModel(doctorData)
       await newDoctor.save()
       res.json({sucess:true,meassge:"Doctor Added"})
    }   
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message});
    }
}

const loginAdmin=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(email=== process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
           const token=jwt.sign(email+password,process.env.JWT_SECRET)
           res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message});
    }
}
const allDoctors=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}
const appointmentsAdmin=async(req,res)=>{
    try{
        const appointments=await appointmentModel.find({})
        res.json({success:true,appointments})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}
const appointmentCancel= async(req,res) =>{
    try{
        const {appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        const {doctorId,slotDate,slotTime}=appointmentData
        const doctorData=await doctorModel.findById(doctorId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e !== slotTime)
        res.json({success:true,message:'Appointment cancelled'})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }

}

const adminDashboard=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({})
        const users=await userModel.find({})
        const appointments=await appointmentModel.find({})
        const dashData={
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}
export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}