import React,{useState} from "react";
import Api from "../api/Signup-Api";
import './Signup.css'
import {Toaster,toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
function Login(){
    const [loginStatus,setLoginStatus]=useState(false)
    const navigate = useNavigate()
    const [loginData,setLoginData]=useState({
        email:'',
        password:''
    })
    const logineChange = (e)=>{
        setLoginData({...loginData,[e.target.name]:e.target.value})
      }
        
       
       

      const handleSubmit=async(e)=>{
        
        try{
             console.log("login seccessfully!",loginData)
            e.preventDefault(); 
           const loginRes = await Api.post('/login',loginData)
                 console.log("login seccessfully!",loginData)
                 
                if(loginRes && loginRes.data.status === true){
                        navigate('/')
                }
                setLoginData({
                    email:'',
                    password:''
                })
                toast.error("Your Password / Email Went Problam")
                setLoginStatus(true)
        }catch(error){
          console.log("some error login",error)
        }
          
      }
    return(
        <div className="form-container">
            <div className="form-card"  >
               <Toaster position="top-right"/>
                <h2>Login in your Account</h2>
                <p className="form-subtitle">Please fill in the login</p>
                <form action="" onSubmit={handleSubmit}>
                     <div className="input-field-group">
                       
                     </div>
                     {/*Email*/}
                     <div className="input-field-group">
                        <label htmlFor="email">Email <span className="required-star">*</span></label>
                        <div className="input-wrapper">
                        <span className="input-icon">
                          <svg
                          width="18" height="18"viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="roud">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                             <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </span>
                        <input type="email"
                        id="password"
                        name="email"
                        placeholder="@email.com"
                        value={loginData.email}
                        onChange={logineChange}
                        required
                        />
                      </div>
                     </div>
                     {/* Password Field */}
          <div className="input-field-group">
            <label htmlFor="password">Password <span className="required-star">*</span></label>
            <div className="input-wrapper">
              <span className="input-icon">
                {/* Lock Icon SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Create a strong password" 
                value={loginData.password}
                onChange={logineChange}
                required 
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" >Submit</button>
           {loginStatus && 
           <span className="Signup-lind">
            <p>Dont't have an account?<a href="/signup" className="signup-btn-text">Signup</a></p>
           </span>
           }
                </form>
               
            </div>

        </div>
    )
}

export default Login;