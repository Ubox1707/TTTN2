import React, { useState } from 'react'
import './register.css'
import Logo from "../../../img/logo.png"
import { Link } from "react-router-dom";



import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        nickName: "",
        password: "",
        email: ""
    }
    )
   
    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, nickName, password }) => {
			try {
				const res = await fetch("/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, nickName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Đăng ký thất bại");
                console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error
			}
		},
		onSuccess: () => {
			toast.success("Đăng ký thành công");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});


    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.id]: e.target.value})
    }

    
    const handleClick = async (e) => {
        e.preventDefault()
        

        // //Check input
        const username = document.getElementById('username').value
        const nickName = document.getElementById('nickName').value
        const password = document.getElementById('password').value
        const email = document.getElementById('email').value

        // //Error
        const usernameErr = document.getElementById('username-err')
        const nickNameErr = document.getElementById('nickName-err')
        const passwordErr = document.getElementById('pass-err')
        const emailErr = document.getElementById('email-err')

        // //Set error
        usernameErr.textContent = ''
        nickNameErr.textContent = ''
        passwordErr.textContent = ''
        emailErr.textContent = ''

        // //Handing
        if(!username){
            usernameErr.textContent = '*Vui lòng nhập Username'
            usernameErr.style.display = 'block'
        }
        if(!nickName){
            nickNameErr.textContent = '*Vui lòng nhập Nickname'
            nickNameErr.style.display = 'block'

        }
        if(!password){
            passwordErr.textContent = '*Vui lòng nhập mật khẩu'
            passwordErr.style.display = 'block'

        }

        if(!email){
            emailErr.textContent = '*Vui lòng nhập email'
            emailErr.style.display = 'block'
            return
        }

		mutate(credentials)
    }

  return (
    <div className='Register'>
        <div className="register-container">
            <div className="register-left">
                <h1 className='register-title' style={{fontFamily: 'Roboto, sans-serif'}} >ĐĂNG KÝ</h1> 
                
                <div>
                    <input 
                    type="text" 
                    id='username' 
                    placeholder='Username' 
                    className='register-input' 
                    required
                    onChange={handleChange}
                    value={credentials.username}
                    />
                    <span className="error" id="username-err"></span>
                </div>
                
                <div>
                    <input 
                    type="text" 
                    id='nickName' 
                    placeholder='Nickname' 
                    className='register-input'
                    required
                    onChange={handleChange} 
                    value={credentials.nickName}
                    />
                    <span className="error" id="nickName-err"></span>
                </div>
                
                <div>
                    <input 
                    type="password" 
                    id='password' 
                    placeholder='Nhập mật khẩu' 
                    className='register-input'
                    required
                    onChange={handleChange} 
                    value={credentials.password}

                    />
                    <span className="error" id="pass-err"></span>

                </div>
              
                <div>
                    <input 
                    type="text" 
                    id='email' 
                    placeholder='Nhập email' 
                    className='register-input'
                    required
                    onChange={handleChange}
                    value={credentials.email}

                    />
                    <span className="error" id="email-err" ></span>

                </div>
                {isError && <p className='error-mess'>{error.message}</p>}
                <button className='button register-btn' onClick={handleClick} >
                {isPending ? "ĐĂNG KÝ..." : "ĐĂNG KÝ"}
                </button>
                <Link to={'/login'} style={{textDecoration: 'none', width: '100%'}} className='register-link'>
                <button className='button register-btn'>ĐĂNG NHẬP</button>
                </Link>
                    
            </div>
            <div className="register-right">
                <img src={Logo} alt="" className='register-logo'/>
                <h1 className='register-web-name' style={{ fontFamily: 'Tittle, sans-serif' }}>Konism</h1>     
            </div>
        </div>
    </div>
  )
}

export default Register
