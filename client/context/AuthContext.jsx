import { createContext, useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL
console.log(backendUrl)
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
  
  const [token,setToken] = useState(localStorage.getItem("token"))
  const [authUser,setAuthUser] = useState(null)
  const [onlineUser,setOnlineUser] = useState([])
  const [socket,setSocket] = useState(null)
  
  const checkAuth = async()=>{
    try {
      const {data} = await axios.get("/api/auth/check")
      if(data.success){
        setAuthUser(data.user)
        connectSocket(data.user)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //login function
  const login = async(state,credentials)=>{
    try {
      const {data} = await axios.post(`/api/auth/${state}`,credentials)
      if(data.success){
        setAuthUser(data.user || data.userData)
        connectSocket(data.user)
        axios.defaults.headers.common["token"] = data.token
        setToken(data.token)
        localStorage.setItem("token",data.token)
        toast.success(data.message)
        console.log("Attempting logging in")
        return true
      }else{
        toast.error(data.message)
        return false
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      return false

    }
  }

  //logout function
  const logout = async()=>{
    try {
      console.log("Attempting to logout...")
      const {data} = await axios.get("/api/auth/logout")
      if(data.success){
        setAuthUser(null)
        setToken(null)
        setOnlineUser([])
        localStorage.removeItem("token")
        socket.disconnect()
        toast.success(data.message)
        axios.defaults.headers.common["token"] = null
      }else{
        toast.error(data.message)
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  //update user profile
 const updateProfile = async(body)=>{
    try {
      const {data} = await axios.put("/api/auth/update-profile",body)
      if(data.success){
        setAuthUser(data.user)
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  //connect scoket function
  const connectSocket = (userData)=>{
    if(!userData || socket?.connected) return
    const newSocket = io(backendUrl,{
      query:{
        userId:userData._id,
      }
    })
    newSocket.connect()
    setSocket(newSocket)
    newSocket.on("getOnlineUsers",(userIds)=>{
      setOnlineUser(userIds)
    })
  }

  useEffect(()=>{
    if(token){
      axios.defaults.headers.common["token"] =token
      checkAuth()
    }
  },[])
  

  const value ={
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
