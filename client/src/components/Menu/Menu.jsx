import React, {useRef, useState} from 'react'
import './menu.css'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


import Logo from '../../img/logo.png'
import SearchIcon from "../../img/search-icon.png"
import HomeIcon from "../../img/home-icon.png"
import { Link } from 'react-router-dom'
import Bell from "../../img/bell-icon.png"
import  ProfilePic from '../../img/mykoni.png'
import PostModal from '../PostModal/PostModal'
import ExitIcon from "../../img/exit-icon.png"


const Menu = () => {



  // Search
  const inputRef = useRef(null);
  const handleInput = () =>{
    inputRef.current.focus();
  }

  // PostBtn
  const [modalOpened, setModalOpened] = useState(false)
  const closeModal = () => {
    setModalOpened(false)
  }
  // Logout
  const queryClient = useQueryClient()
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: () => {
			toast.success("Đăng xuất thành công")

			queryClient.invalidateQueries({ queryKey: ["authUser"] })
		},
		onError: () => {
			toast.error("Đăng xuất thất bại")
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] })
  
 
  // -------
  
  return (
    <div className='Menu'>
      {/* Sidebar */}
      <div className='search-bar'>
        <div className="top-bar">
          <img className='logo' src={Logo} alt="Một con mèo pixel" />
          <h3 className='text-logo' style={{ fontFamily: 'Tittle, sans-serif' }}>Konism</h3>
        </div>
        <div className="search">
          <img src={SearchIcon} alt="Kính lúp" className="search-icon" onClick={handleInput} />
          <input className='search-input' type="text" placeholder='Tìm kiếm...' ref={inputRef} />
        </div>
      </div>

      {/* Home */}
      <Link to='/' className='home-link'>
      <div className='home'>
        <img src={HomeIcon} alt="A pixel house" className="home-icon" />
        <p className="home-title">Trang chủ</p>
      </div>
      </Link>

      {/* Announcement */}
      <Link to='/notifications' className='home-link'>
      <div className='announcement'>
        <img src={Bell} alt="Cái chuông" className="bell-icon" />
        <p className="bell-title">Thông báo</p>
      </div>
      </Link>
      
      {/* Profile */}
      <Link  to={`/profile/${authUser?.username}`} className='home-link'>
      <div className='profile'>
        <img className='profile-icon' src={ProfilePic} alt="Một con mèo" />
        <h2 className="profile-title" style={{ fontFamily: 'Tittle, sans-serif' }}>My Koni</h2>
      </div>
      </Link>

      {/* PostBtn */}
      <div className='post-btn' onClick={() => setModalOpened(true)}>
        {modalOpened && (
          <PostModal onClose ={closeModal}/>
        )}
        <p className="post-btn-title">Post</p>
      </div>

      {/* Logout */}
      <div className='logout' onClick={(e) => {
        e.preventDefault()
        logout()
      }}>
        <img src={ExitIcon} alt="Exit Icon" className="exit-icon" />
        <p className="logout-title">Đăng xuất</p>
      </div>
      
    </div>
  )
}
export default Menu
