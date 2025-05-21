import mongoose from "mongoose"

//Connect MongoDB

export const connectDB = async() => {
  try {
    mongoose.connection.on("connected",()=>
      console.log("Database connected!"));
    await mongoose.connect(`${process.env.MONGO_URI}/chat-app`)
  } catch (error) {
    console.log(error)
  }
}