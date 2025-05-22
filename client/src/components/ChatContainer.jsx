import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const scrollref = useRef()
  
  const {messages,selectedUser,setSelectedUser,sendMessage, getMessages} = useContext(ChatContext)
  const {authUser, onlineUser} = useContext(AuthContext)

  const [input, setInput] = useState("")

  const handleSendMessage = async(e)=>{
    e.preventDefault()
    if(input.trim() === "") return null
    await sendMessage({text:input.trim()})
    setInput("")
  }

  const handleSendImage = async(e)=>{
    const file = e.target.files[0]
    if(!file || !file.type.startsWith("image/")){
      toast.error("Select a valid image")
      return
    }
    const reader = new FileReader()

    reader.onload= async()=>{
      await sendMessage({image:reader.result})
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(()=>{
    if(scrollref.current && messages){
      scrollref.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  return selectedUser ? (
    // Header
    <div className='h-full overflow-scroll relative bacldrop-blur-lg'>
      <div className='flex items-center gap-3 py-3 mx-4 border-b bored-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile"  className='w-8 rounded-full'/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullName} 
          {onlineUser.includes(selectedUser._id) &&<span className='size-2 rounded-full bg-green-500'></span>}
        </p>
        <img src={assets.arrow_icon} alt="arrow" className='md:hidden max-w-7' onClick={()=>{setSelectedUser(null)}} />
        <img src={assets.help_icon} alt="help" className='max-md:hidden max-w-5'/>
      </div>
    {/* chat */}
    <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
      {messages.map((message,index)=>(
        <div key={index} className={`flex items-end gap-2 justify-end ${message.senderId !== authUser._id && 'flex-row-reverse'}`}>
          {
            message.image ? (
              <img src={message.image} alt="image" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
            ): (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${message.senderId === authUser._id ? "rounded-br-none":"rounded-bl-none"}`}>{message.text}</p>
            )
          }
          <div className='text-center text-xs'>
            <img src={message.senderId === authUser._id ? authUser?.profilepic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="images" className='w-7 rounded-full' />
            <p className='text-gray-500'>{formatMessageTime(message.createdAt)}</p>
          </div>
        </div>
      ))}
      <div ref={scrollref}></div>
    </div>
    {/* Bottom area */}
    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
      <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
        <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key==="Enter" ? handleSendMessage(e) : null} type="text" placeholder='Send your message' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
        <input type="file" id='image' accept='image/png,image/jpeg' hidden onChange={handleSendImage}/>
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="gallery" className='w-5 mr-2 cursor-pointer'/>
        </label>
      </div>
      <img onClick={handleSendMessage} src={assets.send_button} alt="send" className='w-7 cursor-pointer' />
    </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="logo" className='max-w-16'/>
      <p className='text-lg font-medium text-white'>Anytime Anywhere</p>
    </div>
  )
}

export default ChatContainer