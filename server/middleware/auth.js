import jwt from "jsonwebtoken";

const auth=(req,res,next)=>{
    const token=req.headers.authorization;

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decoded.id;
        next();
    }catch(error){
        res.json({success:false,message:"Invalid token"})
    }
}

// Decodes the token when present, but never blocks the request — used on
// public reader routes so a logged-in author can also see their own
// private blogs without requiring every visitor to be authenticated.
export const optionalAuth=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.userId=decoded.id;
        }catch(error){
            // ignore invalid/expired token, treat as anonymous
        }
    }
    next();
}

export default auth;
