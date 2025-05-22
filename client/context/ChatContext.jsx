import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({children}) =>{

  const [messages,setMessages] = useState([])
  const [users,setUsers] = useState([])
  const [selectedUser,setSelectedUser] = useState(null)
  const [unseenMessages,setUnseenMessages] = useState({})

  const {socket,axios} = useContext(AuthContext)

  //function to get all user form sidebar
  const getUser = async()=>{
    try {
     const {data} = await axios.get("/api/messages/users")
     if(data.success){
      setUsers(data.users)
      setUnseenMessages(data.unseenMessages)
     }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //function to get message of selected user
  const getMessages = async(userId)=>{
    try {
      const {data} =await axios.get(`/api/messages/${userId}`)
      if(data.success){
        setMessages(data.messages)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //function to send message
  const sendMessage = async(messageData)=>{
    try {
      const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData)
      if(data.success){
        setMessages((prevMessages)=>[...prevMessages,data.newMessage])
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    }

    //subscribe message for selected user
    const subscribeMessage = async()=>{
      if(!socket) return
      socket.on("newMessage",(newMessage)=>{
        if(selectedUser && newMessage.senderId === selectedUser._id){
          newMessage.seen = true
          setMessages((prevMessages)=>[...prevMessages,newMessage])
          axios.put(`/api/messages/mark/${newMessage._id}`)
        }else{
          setUnseenMessages((prevUnseenMessages)=>({
            ...prevUnseenMessages,[newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
          }))
        }
      })
    }

    //unsubscribe from message
    const unsubscribeFromMessages = ()=>{
      if(socket) socket.off("newMessage")
    }

    useEffect(()=>{
      subscribeMessage()
      return ()=>{
        unsubscribeFromMessages()
      }
    },[socket,selectedUser])
 
  const value={
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    getUser,
    getMessages,
    sendMessage,
    setUnseenMessages
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}
