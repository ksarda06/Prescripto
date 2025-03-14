import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import cloudinary from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorsModel.js'
//import razorpay from 'razorpay'
const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !password || !email){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"enter a strong password"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const userData={
            name,email,password:hashedPassword
        }
        const newUser=new userModel(userData)
        const user=await newUser.save()
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})

    }
    catch(err){
         console.log(err)
         res.json({success:false,message:err.message})
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatched=await bcrypt.compare(password,user.password)
        if(isMatched){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}
const getProfile=async(req,res)=>{
    try{
        const {userId}=req.body
        const userData=await userModel.findById(userId).select('-password')
        res.json({success:true,userData})

    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

const updateProfile=async (req,res) =>{
     try{
        const {userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file
        if(!name || !phone || !dob || !gender){
           return res.json({success:false,message:"Data missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL=imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:"Profile Updated"})
     }
     catch(err){
        console.log(err)
        return res.json({success:false,message:err.message})
     }
}
const bookAppointment=async (req,res)=>{
    try{
        const {userId,docId,slotDate,slotTime}=req.body
        const temp=docId.slice(1) 
        const docData=await doctorModel.findById(temp).select('-password')
        if(!docData.available){
            return res.json({success:false,message:"Doctor not available"})
        }
        let slots_booked=docData.slots_booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot not available"})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        const userData=await userModel.findById(userId).select(-'password')
        const appointmentData={
            userId,docId:temp,userData,docData,amount:docData.fees,
            slotTime,slotDate,date:Date.now()
        }
        const newAppointment=new appointmentModel(appointmentData)
        await newAppointment.save()
        console.log(appointmentData)
        await doctorModel.findByIdAndUpdate(temp,{slots_booked})
        delete docData.slots_booked
        res.json({success:true,message:"Appointment Booked"})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
}

const listAppointment=async(req,res)=>{
    try{
        const {userId}=req.body
        const appointments=await appointmentModel.find({userId})
        res.json({success:true,appointments})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }
}

const cancelAppointment= async(req,res) =>{
    try{
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData.userId !== userId){
            return res.json({success:false,message:'Unauthorized action'})
        }
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
/*const razorpayInstance=new razorpay({
    key_id:'',
    key_secret:''
})
const paymentRazorpay=async(req,rees)=>{
    
}*/

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment}