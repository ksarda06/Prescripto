import jwt from "jsonwebtoken"
const authAdmin=async(req,res,next)=>{
     try{
        const {atoken}=req.headers
        if(!atoken){
            return res.json({sucess:false,message:'Not Authorized login again1'})
        }
        const token_decode=jwt.verify(atoken,process.env.JWT_SECRET)
        if(token_decode!=process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return req.res.json({sucess:false,message:'Not Authorized login again2'})
        }
        next()
     }
     catch(err){
        res.json({sucess:false,message:err.message})
     }
}
export default authAdmin