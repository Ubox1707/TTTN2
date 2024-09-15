import React from 'react'
import './login.css'
import Logo from "../../../img/logo.png"
import { useState } from "react"
import { Link } from "react-router-dom"


import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'


const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
})



const navigate = useNavigate()

const queryClient = useQueryClient()

	const {
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Đăng nhập thất bại")
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Đăng nhập thành công")
			queryClient.invalidateQueries({ queryKey: ["authUser"] })
		},
	})

const handleChange = (e) => {
    setCredentials({...credentials, [e.target.id]: e.target.value});
}

const handleClick = async (e) =>{
    e.preventDefault()
    console.log(credentials)
    
    //Check input
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    //Error
    const usernameErr = document.getElementById('username-err')
    const passwordErr = document.getElementById('pass-err')

    //Set error
    usernameErr.textContent = ''
    passwordErr.textContent = ''

     //Handing
     if(!username){
        usernameErr.textContent = '*Vui lòng nhập tên đăng nhập'
        usernameErr.style.display = 'block'
    }

    if(!password){
        passwordErr.textContent = '*Vui lòng nhập mật khẩu'
        passwordErr.style.display = 'block'
    }
    else{
        loginMutation(credentials)
    }
}

  return (
    <div className='Login'>
        <div className="login-container">
            <div className="login-left">
                <img src={Logo} alt="" className='login-logo'/>
                <h1 className='login-web-name' style={{ fontFamily: 'Tittle, sans-serif' }}>Konism</h1>
            </div>
            <div className="login-right">
                <h1 className='login-title' style={{fontFamily: 'Roboto, sans-serif'}} >ĐĂNG NHẬP</h1> 
                <div>
                    <input 
                    value={credentials.username}
                    type="text" 
                    id="username" 
                    placeholder='Tên đăng nhập' 
                    className='login-input' 
                    required
                    onChange={handleChange}
                    />
                    <span className='login-error' id="username-err"></span>
                </div>
                <div>
                    <input 
                    value={credentials.password}
                    type="password" 
                    id="password" 
                    placeholder='Nhập mật khẩu' 
                    className='login-input' 
                    required
                    onChange={handleChange}
                    />
                    <span className="login-error" id='pass-err'></span>
                </div>
                <div>
                    <p className='register-link'>Chưa có tài khoản? 
                        <Link to={'/signup'} style={{ textDecoration: "none"  }}>
                        <a  className='login-link' onClick={() => navigate('/auth/signup')} >Đăng ký ngay</a>
                        </Link>
                    </p>
                </div>
                <button 
                className='button login-btn'
                onClick={handleClick}
                // disabled={loading}
                >
                    {isPending 
                    ? "ĐĂNG NHẬP..."
                    : "ĐĂNG NHẬP"
                    }
                </button> 
                {isError && <p className='error-mess'>{error.message}</p>}
            </div>
        </div>
    </div>
  )
}

export default Login
