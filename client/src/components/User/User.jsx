import React from 'react'
import './user.css'

import { Link } from 'react-router-dom'
import DefautlAvt from '../../img/defaultavt.jpg'
import { useQuery } from '@tanstack/react-query'

const User = () => {
 
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  return (
    <Link  className='user-link'>
      <div className='user'>
        <img 
        src={authUser.profileImg || DefautlAvt}
        alt="Ảnh đại diện" className="user-avt" 
        />
        <div className="user-name">
          <span><b>{authUser.nickName}</b></span>
        </div>
      </div>
    </Link>
    
  )
}

export default User
