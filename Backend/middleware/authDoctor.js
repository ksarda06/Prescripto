import jwt from "jsonwebtoken"
const authDoctor=async(req,res,next)=>{
     try{
        const {dtoken}=req.headers
        if(!dtoken){
            return res.json({sucess:false,message:'Not Authorized login again1'})
        }
        const token_decode=jwt.verify(dtoken,process.env.JWT_SECRET)
        req.body.docId=token_decode.id
        next()
     }
     catch(err){
        console.log(err)
        res.json({sucess:false,message:err.message})
     }
}
export default authDoctor