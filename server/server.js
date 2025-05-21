import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/connectDB.js"
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRouter.js"

const app = express()

//SocketIO supports HTTP Server
const server = http.createServer(app)

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

