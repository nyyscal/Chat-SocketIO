import React from 'react'
import assets from '../assets/assets'

const Sidebar = ({selectedUser,setSelectedUser}) => {
  return (
    <div>
        <div className='pb-5'>
            <div className='flex justify-center items-center'> 
                <img src={assets.logo} alt="logo" className='max-w-' />
                <div className='relative py-2 group'>
                    <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
                    <div>
                        <p className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr className='my- border-t border-gray-500'/>
                        <p className='cursor-pointer text-sm'>Logout</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar