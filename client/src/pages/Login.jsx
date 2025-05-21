import React, { useState } from 'react'
import assets from '../assets/assets'

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up")
  const [fullName,setFullName ] = useState("")
  const [email,setEmail ] = useState("")
  const [password,setPassword ] = useState("")
  const [bio,setBio ] = useState("")
  const [isDataSubmitted,setIsDataSubmitted ] = useState(false)

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(currentState === "Sign Up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* Left */}
      <img src={assets.logo_big} alt="logo" className='w-[min(30vw,250px)]' />
      {/* Right */}
      <form onSubmit={handleSubmit} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className=' font-medium text-2xl gap-42 flex justify-center '>{currentState}
          {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer' />}
        </h2>

        {currentState === "Sign Up" && !isDataSubmitted  && (<input type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' onChange={(e)=>setFullName(e.target.value)} placeholder='Full Name' required/>
      )}
      {
        !isDataSubmitted && (
          <>
          <input
          onChange={(e)=>setEmail(e.target.value)}
          type="email" value={email} placeholder='Email Address' required 
          className='p-2 border border-gray-500 rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500' 
          />
          <input
          onChange={(e)=>setPassword(e.target.value)}
          type="password" value={password} placeholder='*******' required 
          className='p-2 border border-gray-500 rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500' 
          />
          </>
        )
      }
      {
        currentState==="Sign Up" && isDataSubmitted && (
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Proivde a short bio'></textarea>
        )
      }

      <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
        {currentState === "Sign Up" ? "Create Account":"Login"}
      </button>

      <div className='flex items-center gap-2 text-sm text-gray-500'>
        <input type="checkbox" required/>
        <p>Agree to the terms of use & privacy policy.</p>
      </div>

      <div className='flex flex-col gap-2 items-center justify-center'>
        {currentState === "Sign Up" ? (
          <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrentState("Login");setIsDataSubmitted(false)}}
           className='font-medium text-violet-500 cursor-pointer'>Login</span></p>
        ):(
          <p className='text-sm text-gray-600'>Don&apos;t have an account yet? <span onClick={()=>setCurrentState("Sign Up")}
           className='font-medium text-violet-500 cursor-pointer'>Sign up</span></p>
        )}
      </div>
      </form>
    </div>
  )
}

export default Login