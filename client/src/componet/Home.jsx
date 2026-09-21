import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import API from '../api/Axios';
function Home() {
  const [userName,setUserName]=useState('')
  const [loading,setLoading] = useState(false)
  useEffect(()=>{
    try{
       API.get('/profile',{withCredentials:true}).then((res)=>{
        if(res.data.profileStatus){
         setUserName(res.data.userName)
         setLoading(false)
        
        }else {
         
         setUserName('')
        setLoading(true)
          
            
        }
       
       })
    }catch(err){
     console.log(" Catch err in hompage")
    }
    
  },[])
  return (
    <div className="home-container">
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="profile-inner">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
        
        <div className="profile-container">
           <p>Welcome</p>
          <h1>{userName}</h1>
        
        </div>
        
        {/* Hero Section */}
        <section className="hero-section">
          
          {/* Floating Decorative Badges */}
          <div className="floating-chip chip-left">
            <span>📚</span>
            <span>Fast Book Registration</span>
          </div>
          <div className="floating-chip chip-right">
            <span>⭐</span>
            <span>Curated Library Vault</span>
          </div>

          <div className="hero-pill-badge">
            <span className="pulse-glow"></span>
            <span>Next-Gen Library Management System</span>
          </div>

          <h1 className="hero-title">
            Organize, Discover & Manage Your <br />
            <span className="gradient-text">Book Collection</span>
          </h1>

          <p className="hero-description">
            Welcome to <strong>BookVault</strong>. An intuitive, fast, and animated portal to catalog books,
            track loans & registrations, and explore top trending collections in real-time.
          </p>

          <div className="hero-cta-group">
            <Link to="/form" className="hero-btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add New Book</span>
            </Link>

            <Link to="/tabel" className="hero-btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
              <span>Browse Catalog</span>
            </Link>
          </div>
        </section>

        {/* Feature & Route Cards Grid */}
        <section className="features-grid">
          {/* Card 1: Route /form */}
          <div className="feature-card">
            <div className="card-top">
              <div className="card-badge-row">
                <div className="card-icon-box indigo">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <span className="route-tag">Route: /form</span>
              </div>
              <h3 className="card-title">Book Registration</h3>
              <p className="card-desc">
                Quickly catalog new books with title, genre, and pricing into the library database with real-time feedback.
              </p>
            </div>
            <Link to="/form" className="card-link">
              <span>Open Book Form</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Card 2: Route /tabel */}
          <div className="feature-card">
            <div className="card-top">
              <div className="card-badge-row">
                <div className="card-icon-box purple">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                </div>
                <span className="route-tag">Route: /tabel</span>
              </div>
              <h3 className="card-title">Catalog & Records</h3>
              <p className="card-desc">
                Browse all registered books in a comprehensive table, verify user bookings, or delete/reject items instantly.
              </p>
            </div>
            <Link to="/tabel" className="card-link">
              <span>Open Records Table</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Card 3: Route /topList */}
          <div className="feature-card">
            <div className="card-top">
              <div className="card-badge-row">
                <div className="card-icon-box pink">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className="route-tag">Route: /topList</span>
              </div>
              <h3 className="card-title">Top Collections</h3>
              <p className="card-desc">
                Explore curated top lists, grouped statistics, and upload high-resolution book covers dynamically.
              </p>
            </div>
            <Link to="/topList" className="card-link">
              <span>Open Top List</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Quick Routes Navigation Hub */}
        <section className="route-showcase-section">
          <div className="route-showcase-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Direct App Routes:</span>
          </div>

          <div className="route-pills-container">
            <Link to="/form" className="quick-route-pill">
              <span>📝</span>
              <span>/form (Add Book)</span>
            </Link>
            <Link to="/tabel" className="quick-route-pill">
              <span>📊</span>
              <span>/tabel (Records Table)</span>
            </Link>
            <Link to="/topList" className="quick-route-pill">
              <span>⭐</span>
              <span>/topList (Top Collections)</span>
            </Link>
          </div>
        </section>

        {/* Animated Stats Banner */}
        <section className="stats-banner">
          <div className="stat-item">
            <span className="stat-value">⚡ Fast</span>
            <span className="stat-label">Instant Database Sync</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">📚 Dynamic</span>
            <span className="stat-label">Categorized Books</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">🛡️ Secure</span>
            <span className="stat-label">User Booking System</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">✨ Smooth</span>
            <span className="stat-label">60fps Fluid UI</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
