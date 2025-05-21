import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/connectDB.js"
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRouter.js"
import { Server } from "socket.io"

const app = express()

//SocketIO supports HTTP Server
const server = http.createServer(app)

//Initialize SocketIO
export const io = new Server(server,{
  cors:{
    origin:"*",
  }
})

//store online users
export const userScoketMap = {}//useriD:socketId

io.on("connection",(socket)=>{
  const userId = socket.handshake.query.userId;
  console.log("User connected",userId)

  if(userId){
    userScoketMap[userId] = socket.id
  }

  //emit online users
  io.emit("getOnlineUsers",Object.keys(userScoketMap))
  socket.on("disconnect",()=>{
    console.log("User disconnected",userId)
    delete userScoketMap[userId]
    io.emit("getOnlineUsers",Object.keys(userScoketMap))
  })
})

//Middlewares
app.use(express.json({limit:"4mb"}))
app.use(cors())

app.use("/api/status",(req,res)=>{
  res.send("Server is live!")
})

app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

await connectDB()
const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})

