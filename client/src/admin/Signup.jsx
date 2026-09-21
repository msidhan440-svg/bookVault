import React,{useState} from "react";
import Api from "../api/Signup-Api";
import './Signup.css'
import {Toaster,toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
function Signup(){
    const navigate = useNavigate()
    const [showSuccess,setShowSuccess]=useState(false)
    const [formData,setFormData]=useState({
        username:'',
        email:'',
        password:''
    });
       
       const handleSignup=async(e)=>{
        
       }

      const handleChange = (e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
      }
      const handleSubmit=async(e)=>{
        

       try{
        e.preventDefault();
        console.log("Form submitted:",formData)
            const res= await Api.post('/signing',formData)
                 if(res.data.result && res.data.result.status === false){
                     toast.error(res.data.result.message)
                     console.log("errpo")

                   }else{
                     
                setFormData({
                username:'',
                email:'',
                password:''
               })   
            setShowSuccess(true)
            setTimeout(() => {
              setShowSuccess(false)
            }, 6000);
           toast.success("Signup Successfully!")
            navigate('/')
          }
        }catch(err){
            console.log("error submited",err)
            toast.error("Something went wrong!")
           
        }
        
      }
    return(
        <div className="form-container">
            <div className="form-card"  >
               <Toaster position="top-right"/>
                <h2>Creat Account</h2>
                <p className="form-subtitle">Please fill in the sing up</p>
                <form action="" onSubmit={handleSubmit}>
                     <div className="input-field-group">
                        <label htmlFor="username">Username <span className="required-star">*</span></label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                            {/*User icon logo*/}
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                   <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            </span>
                            <input type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your name"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            />
                        </div>
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
                        name="email"
                        placeholder="@email.com"
                        value={formData.email}
                        onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" onClick={handleSignup}>Submit</button>
                </form>
               {showSuccess &&<div className="save-data">
                   <h2>Data saved ⛳</h2>
                </div>}
            </div>

        </div>
    )
}

export default Signup;