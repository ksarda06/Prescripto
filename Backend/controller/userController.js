import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import cloudinary from 'cloudinary'
import appointmentModel from '../models/appointmentModel.js'
import doctorModel from '../models/doctorsModel.js'
import razorpay from 'razorpay'
import transporter from '../config/nodemailer.js'
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
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"User already exists"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const userData={
            name,email,password:hashedPassword
        }
        const newUser=new userModel(userData)
        const user=await newUser.save()
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?
            'none':'strict',
            maxAge:7*24*60*60*1000
        });
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'welcome to prescripto',
            text:`Welcome to great stack website .Your account has been created with email id:${email}` 
        }
        await transporter.sendMail(mailOptions);
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
        if(!email || !password){
            return res.json({success:false,message:'Email and password are required'})
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatched=await bcrypt.compare(password,user.password)
        if(isMatched){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.cookie('token',token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:process.env.NODE_ENV==='production'?
                'none':'strict',
                maxAge:7*24*60*60*1000
            })
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
const logout=async(req,res)=>{
    try{
       res.clearCookie('token',{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?
        'none':'strict',        
       })
       return res.json({success:true,message:"Logged Out"})
    }
    catch(err){
        return res.json({success:false,message:err.message})
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
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData=await doctorModel.findById(docId)
        let slots_booked=doctorData.slots_booked
        slots_booked[slotDate]=slots_booked[slotDate].filter(e=>e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment cancelled'})
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:err.message})
    }

}
const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
const paymentRazorpay=async(req,res)=>{
   try{ 
    const {appointmentId}=req.body
    const appointmentData=await appointmentModel.findById(appointmentId)
    if(!appointmentData || appointmentData.cancelled){
        return res.json({success:false,message:"Appointment Cancelled or not found"})

    }
    const options={
        amount:appointmentData.amount*100,
        currency:process.env.CURRENCY, 
        receipt:appointmentId
    }
    const order=await razorpayInstance.orders.create(options)
    res.json({success:true,order})
  }
  catch(err){
    console.log(err)
    res.json({success:false,message:err.message})
  }
}

const verifyRazorpay=async(req,res)=>{
    try{
        const {razorpay_order_id}=req.body
        const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status==='paid'){
           await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
           res.json({success:true,message:"Payment Successfull"})
        }
        else{
            res.json({success:false,message:"Payment Failed"})
        }
    }
    catch(err){
       console.log(err)
       res.json({success:false,message:err.message})
    }
}
const sendVerifyOtp=async(req,res)=>{
    try{
        const {userId}=req.body;
        const user=await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false,message:"Account already verified"})
        }
        const otp=String(Math.floor(100000+Math.random()*900000));
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            text:`Your OTP is ${otp}.Verify your account using this OTP.` 
        }
        await transporter.sendMail(mailOptions);
        res.json({
            success:true,message:'Verification OTP sent on Email'
        });
    }
    catch(err){
        res.json({success:false,message:err.message});
    }
}
const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;
    if(!userId || !otp){
        return res.json({success:false,message:'Missing Details'});

    }
    try{
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:'User not found'})
        }
        if(user.verifyOtp===''||user.verifyOtp!=otp){
            return res.json({success:false,message:'Invalid OTP'});
        }
        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success:false,message:'OTP Expired'});
        }
        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success:true,message:'Email verified successfully'})
    }
    catch(err){
        return res.json({success:false,message:'Missing Details'});
    }
}
const isAuthenticated=async(req,res)=>{
    try{
       return res.json({success:true});
    }
    catch(err){
        return res.json({succcess:false,message:err.message})
    }
}
const sendResetOtp=async(req,res)=>{
    try{
        const {email}=req.body
        if(!email){
            return res.json({success:false,message:"Email is required"});
        }
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const otp=String(Math.floor(100000+Math.random()*900000));
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password Reset OTP',
            text:`Your OTP for resetting your password is ${otp}.Use this OTP to proceed with resetting your password.` 
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message:"OTP sent to your email"})
    }
    catch(err){
        return res.json({succcess:false,message:err.message})
    }
}
const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:'Email,OTP and new password are required'})
    }
    try{
       const user=await userModel.findOne({email})
       if(!user){
          return res.json({success:false,message:'User not found'})
       }
       if(user.resetOtp==="" || user.resetOtp!==otp){
          return res.json({success:false,message:'Invalid OTP'})
       }
       if(user.resetOtpExpireAt < Date.now()){
          return res.json({success:false,message:'OTP Expired'})
       }
       const hashedPassword=await bcrypt.hash(newPassword,10)
       user.password==hashedPassword
       user.resetOtp='';
       user.resetOtpExpireAt=0;
       await user.save()
       return res.json({success:true,message:'Password has been reset successfully'})
    }
    catch(err){
        return res.json({success:false,message:err.message})
    }
}
export {registerUser,loginUser,logout,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay,sendVerifyOtp,verifyEmail,isAuthenticated,sendResetOtp,resetPassword}