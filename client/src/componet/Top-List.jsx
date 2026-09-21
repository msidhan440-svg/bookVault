import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import API from "../api/Axios";
import { useNavigate } from "react-router-dom";
import './Top-List.css';
import profile from '../assets/profile.png';
import second from '../assets/second.png';
import first from '../assets/first.png';
import third from '../assets/Third.png';
import addImage from '../assets/imageTage.png';
import editImage from '../assets/Edit-Image.png';

function TopList() {
    const [topValue, setTopValue] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewDetails, setViewDetails] = useState([]);
    const [selectedReader, setSelectedReader] = useState(null);
    const [scheduleEdits, setScheduleEdits] = useState({});
    const [savingSchedule, setSavingSchedule] = useState(false);
    const [open, setOpen] = useState(false);
    const [viewImage, setViewImage] = useState(null);
    const [openImage, setOpenImage] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        if (!dateStr) return "Not Scheduled";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "Not Scheduled" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
    };

    const getScheduleStatus = (book) => {
        if (typeof book === 'string') return { label: 'Legacy Record', className: 'status-legacy' };
        if (book.status === 'Returned') return { label: 'Returned', className: 'status-returned' };
        if (!book.dueDate) return { label: 'No Due Date', className: 'status-none' };

        const now = new Date();
        const due = new Date(book.dueDate);
        const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { label: `Overdue (${Math.abs(diffDays)}d)`, className: 'status-overdue' };
        } else if (diffDays <= 3) {
            return { label: `Due Soon (${diffDays}d)`, className: 'status-duesoon' };
        } else {
            return { label: `Active (${diffDays}d left)`, className: 'status-active' };
        }
    };

    const handleDeleteImage = async (userId) => {
        try {
            const response = await API.post('/delete-image', { userId });
            setTopValue(prev =>
                prev.map(item =>
                    item._id === userId ? { ...item, previewUrl: null, profileImage: "" } : item
                )
            );
            if (response.data.success) {
                fetchTopCollection();
                setOpen(false);
                setOpenImage(false);
                toast.success("Profile image removed");
            }
        } catch (err) {
            console.log("Error deleting image", err);
            setTopValue(prev =>
                prev.map(item =>
                    item._id === userId ? { ...item, previewUrl: null, profileImage: "" } : item
                )
            );
            setOpenImage(false);
            toast.success("Preview image cleared");
        }
    };

    const handleViewImage = (imgUrl, userId) => {
        setViewImage(imgUrl);
        setOpenImage(true);
        setSelectedUserId(userId);
    };

    const handleViewDetails = (user) => {
        setSelectedReader(user);
        const booksList = user.books || [];
        setViewDetails(booksList);

        const initialEdits = {};
        booksList.forEach((b) => {
            if (b && typeof b === 'object' && b._id) {
                initialEdits[b._id] = {
                    dueDate: formatDateForInput(b.dueDate),
                    status: b.status || 'Active'
                };
            }
        });
        setScheduleEdits(initialEdits);
        setOpen(true);
    };

    const handleSaveSchedule = async (bookId) => {
        const edit = scheduleEdits[bookId];
        if (!edit) return;
        setSavingSchedule(true);
        try {
            const res = await API.post('/update-schedule', {
                scheduleId: bookId,
                dueDate: edit.dueDate || null,
                status: edit.status
            });
            if (res.data.success) {
                toast.success("Schedule updated successfully!");
                fetchTopCollection();
                setViewDetails(prev =>
                    prev.map(b => (b._id === bookId ? { ...b, dueDate: edit.dueDate, status: edit.status } : b))
                );
            }
        } catch (err) {
            console.error("Error updating schedule", err);
            toast.error("Failed to update schedule");
        } finally {
            setSavingSchedule(false);
        }
    };

    const handleAddImage = async (userId, e) => {
        const file = e.target.files[0];
        if (file) {
            // Instant local preview in state before server upload
            const imageurl = URL.createObjectURL(file);
            setTopValue(prev =>
                prev.map(item =>
                    item._id === userId
                        ? { ...item, selectedImage: file, previewUrl: imageurl }
                        : item
                )
            );

            const formData = new FormData();
            formData.append('image', file);
            formData.append('userId', userId);

            try {
                await API.post('/upload-image', formData, { withCredentials: true });
                toast.success("Image uploaded successfully!");
                window.location.reload()
            } catch (err) {
                console.error("Upload error:", err);
                toast.error("Error uploading image to server");
            }
        }
    };

    const fetchTopCollection = () => {
        API.get('/top-collection')
            .then((res) => {
                setTopValue(res.data.result || []);
                if (res.data.loginStatus === false) {
                    navigate('/login');
                }
            }).catch((err) => {
                console.log("Fetching error data", err);
            });
    };

    useEffect(() => {
        fetchTopCollection();
    }, []);

    // Case-insensitive filtering across name, address, book count, book titles, and statuses
    const filteredTopValue = topValue.filter((user) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase().trim();
        const nameMatch = user._id ? user._id.toLowerCase().includes(term) : false;
        const addressMatch = user.first ? user.first.toLowerCase().includes(term) : false;
        const countMatch = user.totalBookCount ? user.totalBookCount.toString().includes(term) : false;
        const booksMatch = Array.isArray(user.books)
            ? user.books.some(b => {
                if (typeof b === 'string') return b.toLowerCase().includes(term);
                if (b && typeof b === 'object') {
                    return (b.bookName && b.bookName.toLowerCase().includes(term)) ||
                           (b.category && b.category.toLowerCase().includes(term)) ||
                           (b.status && b.status.toLowerCase().includes(term));
                }
                return false;
            })
            : false;
        return nameMatch || addressMatch || countMatch || booksMatch;
    });

    const selectedUser = topValue.find(u => u._id === selectedUserId);

    return (
        <div className="toplist-page">
            <Toaster position="top-center" />

            {/* Search and Control Header */}
            <div className="toplist-control-header">
                <div className="toplist-title-area">
                    <h2 className="toplist-title">Top Readers Leaderboard & Schedules</h2>
                    <p className="toplist-subtitle">Manage reader achievements, book borrowing schedules, and return due dates</p>
                </div>

                <div className="toplist-search-wrapper">
                    <div className="search-bar-box">
                        <svg
                            className="search-bar-icon"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            className="search-bar-input"
                            placeholder="Search by reader, address, book, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="search-clear-btn"
                                onClick={() => setSearchTerm("")}
                                title="Clear search"
                                type="button"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="search-count-badge">
                        Showing <strong>{filteredTopValue.length}</strong> of {topValue.length} readers
                    </div>
                </div>
            </div>

            {/* Cards Grid Container */}
            <div className="container">
                {filteredTopValue && filteredTopValue.length > 0 ? (
                    filteredTopValue.map((user) => {
                        const originalRank = topValue.findIndex(item => item._id === user._id);
                        let rangTag = "";
                        if (originalRank === 0) rangTag = <img src={first} alt="1st" style={{ width: 70, height: 70 }} />;
                        else if (originalRank === 1) rangTag = <img src={second} alt="2nd" style={{ width: 70, height: 70 }} />;
                        else if (originalRank === 2) rangTag = <img src={third} alt="3rd" style={{ width: 70, height: 70 }} />;

                        // Find earliest upcoming active due date
                        let earliestDue = null;
                        if (Array.isArray(user.books)) {
                            user.books.forEach(b => {
                                if (b && typeof b === 'object' && b.dueDate && b.status !== 'Returned') {
                                    const d = new Date(b.dueDate);
                                    if (!earliestDue || d < earliestDue) earliestDue = d;
                                }
                            });
                        }

                        const currentImgSrc = user.previewUrl
                            ? user.previewUrl 
                            : user.profileImage
                            ? `http://localhost:5000/uploads/${user.profileImage}`
                            : profile;

                        return (
                            <div className="card" key={user._id}>
                                {rangTag && <span className="rang-tag">{rangTag}</span>}

                                <div className="card-content">
                                    <div className="profile-img-container">
                                        <img
                                            src={currentImgSrc}
                                            alt="profile"
                                            className="img"
                                            onClick={() => handleViewImage(currentImgSrc, user._id)}
                                        />

                                        <div
                                            className="add-img"
                                            onClick={() => document.getElementById(`file-input-${user._id}`).click()}
                                            title="Upload/Edit Photo"
                                        >
                                            <input
                                                type="file"
                                                id={`file-input-${user._id}`}
                                                onChange={(e) => handleAddImage(user._id, e)}
                                                style={{ display: "none" }}
                                                accept="image/*"
                                            />
                                            <img src={user.previewUrl || user.profileImage ? editImage : addImage} alt="edit" style={{ width: 14, height: 14 }} />
                                        </div>
                                    </div>

                                    <div className="details">
                                        <p><strong>Name: </strong>{user._id}</p>
                                        <p><strong>Address: </strong>{user.first}</p>
                                        <p><strong>Book Count: </strong>{user.totalBookCount}</p>

                                        <div className="card-schedule-pill">
                                            <span className="calendar-icon">📅</span>
                                            <span>
                                                {earliestDue ? `Next Due: ${formatDate(earliestDue)}` : "Schedule Active"}
                                            </span>
                                        </div>

                                        <button
                                            className="view-btn schedule-action-btn"
                                            onClick={() => handleViewDetails(user)}
                                        >
                                            View Schedule & Books
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="toplist-empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>No readers found</h3>
                        <p>No results match "<strong>{searchTerm}</strong>". Try searching for a different reader name, address, or book title.</p>
                        <button className="reset-search-btn" onClick={() => setSearchTerm("")}>
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            {/* Borrowing Schedule & Book Details Modal */}
            {open && (
                <div className="model-ovrely" onClick={() => setOpen(false)}>
                    <div className="content schedule-modal animation" onClick={(e) => e.stopPropagation()}>
                        <div className="schedule-modal-top">
                            <div className="modal-header-info">
                                <div className="modal-header-icon-box">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="modal-heading">Borrowing Schedule & Records</h3>
                                    <div className="modal-subheading-wrap">
                                        <span className="reader-badge-pill">
                                            👤 <strong>{selectedReader?._id}</strong>
                                        </span>
                                        {selectedReader?.first && (
                                            <span className="reader-address-pill">
                                                📍 {selectedReader.first}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button className="close-x-btn" onClick={() => setOpen(false)} title="Close Modal">✕</button>
                        </div>

                        {/* Quick Stats Ribbon */}
                        <div className="modal-stats-ribbon">
                            <div className="stat-pill">
                                <span className="stat-num">{viewDetails ? viewDetails.length : 0}</span>
                                <span className="stat-text">Total Books</span>
                            </div>
                            <div className="stat-pill stat-active">
                                <span className="stat-num">
                                    {(viewDetails || []).filter(b => typeof b === 'object' && b.status !== 'Returned').length}
                                </span>
                                <span className="stat-text">Active Loans</span>
                            </div>
                            <div className="stat-pill stat-overdue">
                                <span className="stat-num">
                                    {(viewDetails || []).filter(b => {
                                        if (typeof b !== 'object' || b.status === 'Returned' || !b.dueDate) return false;
                                        return new Date(b.dueDate) < new Date();
                                    }).length}
                                </span>
                                <span className="stat-text">Overdue</span>
                            </div>
                        </div>

                        <div className="schedule-list">
                            {viewDetails && viewDetails.length > 0 ? (
                                viewDetails.map((book, idx) => {
                                    const isObject = book && typeof book === 'object';
                                    const bookId = isObject ? book._id : idx;
                                    const statusObj = getScheduleStatus(book);
                                    const currentEdit = isObject && scheduleEdits[bookId] ? scheduleEdits[bookId] : {};

                                    return (
                                        <div className="schedule-card-item" key={bookId}>
                                            <div className="schedule-card-header">
                                                <div className="book-title-meta">
                                                    <span className="book-index">#{idx + 1}</span>
                                                    <div>
                                                        <h4 className="schedule-book-name">{isObject ? book.bookName : book}</h4>
                                                        {isObject && book.category && (
                                                            <span className="schedule-category-badge">{book.category}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`status-tag ${statusObj.className}`}>
                                                    <span className="status-dot"></span>
                                                    {statusObj.label}
                                                </span>
                                            </div>

                                            {isObject && (
                                                <div className="schedule-form-grid">
                                                    <div className="form-item">
                                                        <span className="form-label">Borrowed On</span>
                                                        <span className="form-value">
                                                            📅 {formatDate(book.borrowDate)}
                                                        </span>
                                                    </div>

                                                    <div className="form-item">
                                                        <label className="form-label">Return Due Date</label>
                                                        <input
                                                            type="date"
                                                            className="schedule-date-control"
                                                            value={currentEdit.dueDate !== undefined ? currentEdit.dueDate : formatDateForInput(book.dueDate)}
                                                            onChange={(e) => {
                                                                setScheduleEdits(prev => ({
                                                                    ...prev,
                                                                    [bookId]: {
                                                                        ...prev[bookId],
                                                                        dueDate: e.target.value
                                                                    }
                                                                }));
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="form-item">
                                                        <label className="form-label">Loan Status</label>
                                                        <select
                                                            className="schedule-select-control"
                                                            value={currentEdit.status !== undefined ? currentEdit.status : (book.status || 'Active')}
                                                            onChange={(e) => {
                                                                setScheduleEdits(prev => ({
                                                                    ...prev,
                                                                    [bookId]: {
                                                                        ...prev[bookId],
                                                                        status: e.target.value
                                                                    }
                                                                }));
                                                            }}
                                                        >
                                                            <option value="Active">Active / Borrowed</option>
                                                            <option value="Returned">Returned</option>
                                                            <option value="Overdue">Overdue</option>
                                                        </select>
                                                    </div>

                                                    <div className="form-item form-btn-item">
                                                        <button
                                                            className="save-schedule-action"
                                                            disabled={savingSchedule}
                                                            onClick={() => handleSaveSchedule(bookId)}
                                                        >
                                                            {savingSchedule ? (
                                                                "Saving..."
                                                            ) : (
                                                                <>
                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                    </svg>
                                                                    Save
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="no-schedules-found">No books or schedules recorded for this reader.</p>
                            )}
                        </div>

                        <div className="schedule-modal-actions">
                            <button className="done-btn" onClick={() => setOpen(false)}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Image View Modal */}
            {openImage && (
                <div className="image-overly" onClick={() => setOpenImage(false)}>
                    <div className="content-image animation" onClick={(e) => e.stopPropagation()}>
                        <div className="image-viewer-header">
                            <div className="image-viewer-title-wrap">
                                <div className="image-viewer-icon">🖼️</div>
                                <div>
                                    <h4 className="image-viewer-title">{selectedUser?._id ? `${selectedUser._id}'s Photo` : 'Profile Photo'}</h4>
                                    <span className="image-viewer-subtitle">BookVault Reader Profile</span>
                                </div>
                            </div>
                            <button className="image-viewer-x" onClick={() => setOpenImage(false)}>✕</button>
                        </div>

                        <div className="image-frame">
                            <img src={viewImage} alt="Profile" className="image-preview-element" />
                        </div>

                        <div className="image-viewer-actions">
                            {(selectedUser?.profileImage || selectedUser?.previewUrl) ? (
                                <button
                                    className="image-delete-btn"
                                    onClick={() => handleDeleteImage(selectedUserId)}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Remove Photo
                                </button>
                            ) : null}
                            <button onClick={() => setOpenImage(false)} className="image-done-btn">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TopList;