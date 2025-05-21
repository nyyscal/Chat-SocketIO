//Middleware for authUser

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async(req,res,next)=>{
  try {
    const {token}= req.headers.token;
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")
    if(!user){
      return res.status(401).json({message:"Unauthorized, user not found",success:false})
    }
    req.user = user
    next()
  } catch (error) {
    console.log("Error in auth middleware",error)
    res.status(401).json({message:"Unauthorized, invalid token",success:false})
  }
}