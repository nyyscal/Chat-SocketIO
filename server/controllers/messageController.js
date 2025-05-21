//get all users except logged in user

import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js"

export const getUsersForSidebar = async(req,res)=>{
  try {
    const userId = req.user._id
    const filterUsers = await User.find({_id:{$ne:userId}}).select("-password");

    //count number of messafges unseen
    const unseenMessages = {}
    const promises = filterUsers.map(async(user)=>{
      const messages = await Message.find({
        senderId:user._id,
        receiverId:userId,
        seen:false
      })
      if(messages.length > 0){
        unseenMessages[user._id] = messages.length
      }
    })
    await Promise.all(promises)
    res.json({success:true,users:filterUsers,unseenMessages})
  } catch (error) {
    console.log("Error in getUsersForSidebar controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}

//get all messaes for selected users
export const getMessages = async(req,res)=>{
  try {
    const {id:selectedUserId} = req.params
    const myId = req.user._id
    const messages = await Message.find({
      $or:[
        {
          senderId:myId,
          receiverId:selectedUserId
        },
        {
          senderId:selectedUserId,
          receiverId:myId
        }
      ]
    })
    await Message.updateMany({
      senderId:selectedUserId,
      receiverId:myId,
    },{
      seen:true
    })
    res.json({success:true,messages})
  } catch (error) {
    console.log("Error in getMessages controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"})
  }
}

//marks message seen using message id
export const markMessageAsSeen = async(req,res)=>{
  try {
    const {id} = req.params
    await Message.findByIdAndUpdate(id,{
      seen:true
    })
    res.json({success:true,message:"Message marked as seen"})
  } catch (error) {
    console.log("Error in markMessageAsSeen controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"})
    
  }
}

//send message
export const sendMessage = async(req,res)=>{
  try {
    const {text,image} = req.body
    const receiverId = req.params.id
    const senderId = req.user._id

    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = await Message.create({
      text,
      image:imageUrl,
      senderId,
      receiverId
    })

    res.json({success:true,newMessage})

  } catch (error) {
    console.log("Error in sendMessage controller",error)
    res.status(500).json({success:false,message:"Internal Server Error"})
    
  }
}