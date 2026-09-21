import React,{useEffect,useState} from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom"; 
import "./Header.css";
import API from "../api/Axios";
import ApiAdmin from '../api/Signup-Api'
import Profile from '../assets/profile.png'
function Header() {
  const navigate = useNavigate()
  const [userNameProfile,setUserNameProfile]=useState('')
  const [profileStatus,setProfileStatus]=useState(false)
  const [profileId,setProfileId]=useState('')
  const [imageId,setImageId]=useState("")
  const [imageStatus,setImageStatus]=useState(false)
  const handleDeletImage = (e) => {
    e.stopPropagation();
    ApiAdmin.post('/delete-profile-img', { profileId }, { withCredentials: true })
      .then((res) => {
        console.log("Delete image success:", res.data);
        setImageId("");
      })
      .catch((err) => {
        console.log("Error deleting image:", err);
      });
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('profileId', profileId);

      ApiAdmin.post('/upload-profile-img', formData, {
        withCredentials: true,
      })
        .then((res) => {
          console.log("Image uploaded successfully:", res.data);
          fetchImage();
        })
        .catch((err) => {
          console.log("Error uploading image:", err);
        });
    }
  };
  const handleLogout=(e)=>{
    API.get('/logout',{withCredentials:true}).then((res)=>{
      if(res.data.logoutStatus){
        setProfileStatus(false)
       window.location.reload()
      }
      
    })
  }
   const handleLogin=(e)=>{
    
      navigate('/login')
       window.location.reload()
    
   }
  const profileData = async()=>{
     try{
      const profilfetche= await API.get('/profile',{withCredentials:true})
        
         
           if(profilfetche.data.profileStatus){
             
            
               setProfileStatus(true)
               setUserNameProfile(profilfetche.data.userName)
               setProfileId(profilfetche.data.user_id )
                 fetchImage()
            }else{
              setProfileStatus(false)
              setUserNameProfile('') 
          }
      
    }catch(err){
      console.log("Catch error",err)
    }
    
  }
  const fetchImage = ()=>{
      try{
         ApiAdmin.get('/admin-image',{withCredentials:true}).then((res)=>{
         setImageId(res.data.image)
         console.log("Image fetch",res.data.image)
         setImageStatus(false)
       })
       
    }catch(err){
    console.log("Imge fetch is working")
    }
  } 
  useEffect(()=>{
   profileData()
   
  },[])
  return (
    <header className="app-navbar-container">
      <div className="app-navbar-inner">
        {/* Book Brand Logo & Name */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-box" title="Library Management">
            {/* Attractive Book Logo SVG */}
         
            
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="brand-info">
            <span className="brand-title">
              Book<span className="accent-gradient">Vault</span>
            </span>
            <span className="brand-subtitle">Library Portal</span>
          </div>
        </Link>

        {/* Navigation Links with Active State */}
        <nav>
          <ul className="navbar-nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                {/* Home Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Home</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/form"
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                {/* Book Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Add Book</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/tabel"
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
                <span>Books Table</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/topList"
                className={({ isActive }) =>
                  `nav-link-item ${isActive ? "active" : ""}`
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Top List</span>
                
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Side Status / Quick Action */}
        <div className="navbar-actions">
          <div className="system-status-pill">
            <span className="status-dot-pulse"></span>
            <span>Library Live</span>
          </div>

          <Link to="/form" className="header-action-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"header-logut-btn
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Book</span>
          </Link>

          
             
            
          
        </div>
        {profileStatus ? (
          <div className="header-user-profile">
            {/* Unobscured Profile Avatar Image */}
            <img
              className="profile-avatar-img"
              src={imageId ? `http://localhost:5000/${imageId}` : Profile}
              alt="Profile"
            />

            {/* Profile Action Buttons placed cleanly next to the avatar */}
            <div className="profile-img-actions">
              <label
                htmlFor={`profile-id-${profileId}`}
                className="profile-action-btn upload-action-btn"
                title="Upload Profile Picture"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </label>
              <input
                type="file"
                id={`profile-id-${profileId}`}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfileImage}
              />
              {imageId && (
                <button
                  type="button"
                  className="profile-action-btn delete-action-btn"
                  onClick={handleDeletImage}
                  title="Remove Profile Picture"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              )}
            </div>

            <span className="profile-user-name">{userNameProfile}</span>
            <button className="header-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="header-user-profile">
            <button className="header-login-btn" onClick={handleLogin}>
              Login
            </button>
          </div>
        )}
     
           
      </div>
      
    </header>
  );
}

export default Header;
