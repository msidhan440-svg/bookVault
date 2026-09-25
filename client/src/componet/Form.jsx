import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api/Axios';
import './Form.css';
import Api from '../api/Signup-Api';

function Form() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMsg('');

    try {
      const res = await API.post('/user', {
        name,
        category,
        price,
        
      },{withCredentials:true},
       
    )
      
      const successText = res.data?.message || 'Book added successfully! 📚';
      setResponseMsg(successText);
      setIsSuccess(true);
      toast.success(successText);

      // Clear input fields
      setName('');
      setCategory('');
      setPrice('');
    } catch (error) {
      console.error('Error sending:', error);
      const errorText = error.response?.data?.error || 'Failed to add book!';
      setResponseMsg(errorText);
      setIsSuccess(false);
      toast.error(errorText);
    } finally {
      setIsLoading(false);
    }
  };
useEffect(()=>{
  API.get('/user').then((res)=>{
    try{
       if(res.data.loginStatus  === false){
         navigate('/login')
  
    }
    }catch(err){
      console.log("err:",err)
    }
   
  })
},[])
  return (
    <div className="modern-form-wrapper">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="modern-form-card">
        {/* Form Header with Book Logo */}
        <div className="form-header">
          <div className="form-icon-badge" title="Book Registration">
            {/* Attractive Book Logo SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h2 className="form-title">Add New Book</h2>
          <p className="form-subtitle">Enter book details to add to library catalog</p>
        </div>

        {/* Form Body */}
        <form className="form-body" onSubmit={handleSubmit}>
          {/* Book Title / Name Field */}
          <div className="input-field-group">
            <label htmlFor="form-book-name" className="input-label">
              Book Title <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                {/* Book Bookmark Icon */}
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
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <input
                id="form-book-name"
                type="text"
                className="styled-input"
                placeholder="Enter book title (e.g. The Alchemist)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category / Genre Field */}
          <div className="input-field-group">
            <label htmlFor="form-category" className="input-label">
              Category / Genre <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                {/* Category Tag Icon */}
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
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </span>
              <input
                id="form-category"
                type="text"
                className="styled-input"
                placeholder="e.g. Fiction, Science, History, Novel"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Price Field */}
          <div className="input-field-group">
            <label htmlFor="form-price" className="input-label">
              Price (₹) <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                {/* Currency / Price Icon */}
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
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </span>
              <input
                id="form-price"
                type="number"
                step="any"
                className="styled-input"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                <span>Adding Book...</span>
              </>
            ) : (
              <>
                <span>Add Book</span>
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Status Notification Banner */}
        {responseMsg && (
          <div className={`status-banner ${isSuccess ? 'success' : 'error'}`}>
            {isSuccess ? (
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{responseMsg}</span>
          </div>
        )}

        {/* Footer with Navigation */}
        <div className="form-footer">
          <button type="button" className="nav-link-btn" onClick={() => navigate('/tabel')}>
            <span>View All Books in Table</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form;
