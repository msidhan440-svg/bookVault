import React, { useEffect, useState } from 'react'
import './Table.css'
import API from '../api/Axios'
import { useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'

function Table() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [valueReject, setValueReject] = useState('')
  const navigate = useNavigate()
  const [registerStatus, setRegisterStatus] = useState(false)
  const [deletedStatus, setDeleteStatus] = useState('')
  const [reLoading, setReLoading] = useState(false)
  
  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBookId, setEditingBookId] = useState(null)
  const [editFormData, setEditFormData] = useState({ name: '', category: '', price: '' })
  const [isUpdating, setIsUpdating] = useState(false)

  const register = async (id) => {
    try {
      const res = await API.get(`/register/${id}`)
      const registerData = res.data
      if (registerData.isAlredyRegistered) {
        toast.error(`Sorry this already booked by ${registerData.userName}`)
        setRegisterStatus(true)
        setItems(prevItems =>
          prevItems.map(user =>
            user._id === id ? {
              ...user,
              isAlredyRegistered: true
            } : user
          )
        )
      } else {
        navigate(`/register/${id}`)
        setRegisterStatus(false)
      }
    } catch (err) {
      console.log("Error checking status", err)
    }
  }

  // Delete Action with Modern SweetAlert Confirmation
  const handleDeleteBook = (e, book) => {
    e.stopPropagation()
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${book.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc',
      customClass: {
        popup: 'swal2-dark-popup'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await API.delete(`/delete-book/${book._id}`)
          if (res.data.success) {
            setItems(prevItems => prevItems.filter(item => item._id !== book._id))
            Swal.fire({
              title: 'Deleted Successfully!',
              text: `"${book.name}" has been removed.`,
              icon: 'success',
              confirmButtonColor: '#3b82f6',
              background: '#0f172a',
              color: '#f8fafc'
            })
          } else {
            toast.error(res.data.error || 'Failed to delete record')
          }
        } catch (err) {
          console.error('Delete error:', err)
          toast.error('An error occurred while deleting')
        }
      }
    })
  }

  // Open Edit Modal with Pre-populated Data
  const handleEditClick = (e, book) => {
    e.stopPropagation()
    setEditingBookId(book._id)
    setEditFormData({
      name: book.name || '',
      category: book.category || '',
      price: book.price || ''
    })
    setIsEditModalOpen(true)
  }

  // Submit Edit Form & Update Record Dynamically
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingBookId) return
    setIsUpdating(true)
    try {
      const res = await API.put(`/update-book/${editingBookId}`, editFormData)
      if (res.data.success) {
        setItems(prevItems =>
          prevItems.map(item =>
            item._id === editingBookId ? { ...item, ...editFormData } : item
          )
        )
        toast.success('Book details updated successfully!')
        setIsEditModalOpen(false)
        setEditingBookId(null)
      } else {
        toast.error(res.data.error || 'Failed to update book')
      }
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Error updating book details')
    } finally {
      setIsUpdating(false)
    }
  }

  const Reject = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject data/delete this data?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setReLoading(true)
        try {
          const res = await API.get(`/reject/${id}`)
          setValueReject(res.data)

          if (res.data.isDeleted) {
            fetchItems()
            setDeleteStatus("This data unregistered")
            Swal.fire({
              title: 'Success',
              text: 'This data unregistered successfully',
              icon: 'success',
              confirmButtonText: 'OK'
            })
          }
        } catch (error) {
          console.log("reject err", error)
        } finally {
          setReLoading(false)
        }
      }
    })
  }

  const fetchItems = () => {
    API.get('/user', { withCredentials: true })
      .then((res) => {
        if (res.data.loginStatus === false) {
          navigate('/login')
        } else {
          setItems(res.data.users)
          setLoading(false)
          setValueReject(res.data)
          console.log("data",res.data.users)
         
        }
       
      })
      .catch((err) => {
        console.log("Fetching error", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className='tableParent'>
    
      <Toaster position="top-center" reverseOrder={false} />
      <table className='table'>
        <thead>
          <tr className='tableHead'>
            <th className='tableTh'>Count</th>
            <th className='tableTh'>Name</th>
            <th className='tableTh'>Category</th>
            <th className='tableTh'>Price</th>
            <th className='tableTh' style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items && items.length > 0 ? (
            items.map((user, index) => {
              return (
                <tr key={user._id || index} className='tableTbodyTr' onClick={() => register(user._id)}>
                  <th scope="row" className='tableTd'>{index + 1}</th>
                  <td className='tableTd'>{user.name}</td>
                  <td className='tableTd'>{user.category}</td>
                  <td className='tableTd'>₹{user.price}</td>
                  <td className='tableTd action-cell' onClick={(e) => e.stopPropagation()}>
                    <div className="action-buttons-group">
                      <button
                        className='action-btn edit-action-btn'
                        onClick={(e) => handleEditClick(e, user)}
                        title="Edit Book Details"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        className='action-btn delete-action-btn'
                        onClick={(e) => handleDeleteBook(e, user)}
                        title="Delete Book"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Delete</span>
                      </button>

                      {user.isAlredyRegistered === true && (
                        <button
                          className='action-btn reject-action-btn'
                          onClick={(e) => {
                            e.stopPropagation()
                            Reject(user._id)
                          }}
                          title="Reject Booking"
                        >
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="5" className="table-no-data-cell">
                <div className="table-no-data-wrapper">
                  <div className="no-data-animated-icon">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      <line x1="9" y1="9" x2="15" y2="9" />
                      <line x1="9" y1="13" x2="13" y2="13" />
                    </svg>
                  </div>
                  <h4 className="no-data-heading">No Data Available </h4>
                  <p className="no-data-subtext">There are currently no book records found in the table.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
       
      </div>
             
      {/* Modern Pre-populated Edit Book Modal */}
      {isEditModalOpen && (
        <div className="table-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="table-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="table-modal-header">
              <div className="modal-title-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <h3>Edit Book Record</h3>
              </div>
              <button className="modal-close-icon" onClick={() => setIsEditModalOpen(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="table-modal-body">
              <div className="modal-input-group">
                <label>Book Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="e.g. Thalatherichavan"
                />
              </div>

              <div className="modal-input-group">
                <label>Category</label>
                <input
                  type="text"
                  required
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  placeholder="e.g. Story"
                />
              </div>

              <div className="modal-input-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  placeholder="e.g. 300"
                />
              </div>

              <div className="table-modal-footer">
                <button
                  type="button"
                  className="modal-btn cancel-btn"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn save-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table

