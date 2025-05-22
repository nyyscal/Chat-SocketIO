import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


//Sign Up New User
export const signup = async(req,res)=>{
  const {fullName,email,password,bio}= req.body;
  try {
    if(!fullName || !email || !password || !bio){
      return res.status(400).json({message:"Please fill all the fields.",success:false})
    }
    const exisitngUser = await User.findOne({email});
    if(exisitngUser){
      return res.status(400).json({message:"Account already exists",success:false})
    }
    const salt= await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const newUser = await User.create({
      fullName,
      email,
      password:hashedPassword,
      bio
    })

    const token = generateToken(newUser._id)

    res.json({success:true,user:newUser,token,message:"Account created succesfully."})
  } catch (error) {
    console.log("Error in signup controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}

//Login Controller
export const login = async(req,res)=>{
  const {email,password}= req.body;
  try {
    const userData = await User.findOne({email})
    const isPasswordCorrect = await bcrypt.compare(password,userData.password)
    if(!isPasswordCorrect){
      return res.status(400).json({message:"Invalid credentials",success:false})
    }
    const token = generateToken(userData._id)
    res.json({success:true,user:userData,token,message:"Login successful"})
  } catch (error) {
    console.log("Error in login controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"}) 
  }
}

//controller for middleware
export const checkAuth = async(req,res)=>{
  res.json({success:true,user:req.user})
}

//Controller for updating user profile
export const updateProfile = async(req,res)=>{
  try {
    const {profilePic,bio,fullName} = req.body;
    const userId= req.user._id
    let updatedUser;
    if(!profilePic){
      updatedUser = await User.findById(userId,{bio,fullName},{new:true})
    }else{
      const upload = await cloudinary.uploader.upload(profilePic)
      updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
    }
    res.json({success:true,user:updatedUser,message:"Profile updated successfully"})
  } catch (error) {
    console.log("Error in update profile controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}

// Logout controller
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({
      success: false,
      message: "Failed to logout. Please try again.",
    });
  }
};

