import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import logo from '../../assets/logo.png';
import '../../styles/sidebar.css'

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [showLogout, setShowLogout] = useState(false);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
              withCredentials: true,
            });
            if (response.data.user) {
              setUserId(response.data.user._id);
            }
          } catch (err) {
            console.error('Error checking authentication:', err);
          }
        };
    
        fetchUser();
      }, []);

      useEffect(() => {
        const fetchUsername = async () => {
            if (!userId) return; // Wait for userId to be available

            try {
                const response = await axios.get(`http://localhost:3001/api/auth/get-username/${userId}`);
                if (response.data.success) {
                    setUsername(response.data.username);
                } else {
                    console.error('Failed to fetch username:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching username:', err);
            }
        };

        fetchUsername();
    }, [userId]);
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const toggleLogout = () => {
        setShowLogout((prevState) => !prevState);
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <div className={`menu ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="logo" onClick={toggleSidebar}>
                <img src={logo} alt="image-icon" />
                <p className='logoName'>MediCo</p>
                <div className="menu-icon">
                    <Icon icon="icon-park-outline:hamburger-button" />
                </div>
            </div>

            <div className={`sidenavbar ${isCollapsed ? 'collapsed' : ''}`}>
                <Link to="/dashboard">
                    <ul
                        className={`item ${activeItem === 'dashboard' ? 'active' : ''}`}
                        onClick={() => handleItemClick('dashboard')}
                    >
                        <Icon icon="mage:dashboard-fill" />
                        {!isCollapsed && 'Dashboard'}
                    </ul>
                </Link>

                <Link to="/flashcards">
                    <ul
                        className={`item ${activeItem === 'flashcards' ? 'active' : ''}`}
                        onClick={() => handleItemClick('flashcards')}
                    >
                        <Icon icon="ph:cards-fill" />
                        {!isCollapsed && 'Flash Cards'}
                    </ul>
                </Link>

                <Link to="/community">
                    <ul
                        className={`item ${activeItem === 'community' ? 'active' : ''}`}
                        onClick={() => handleItemClick('community')}
                    >
                        <Icon icon="fluent:people-community-24-filled" />
                        {!isCollapsed && 'Community'}
                    </ul>
                </Link>
                
                <Link to="/class">
                    <ul
                        className={`item ${activeItem === 'class' ? 'active' : ''}`}
                        onClick={() => handleItemClick('class')}
                    >
                        <Icon icon="streamline:class-lesson-solid" />
                        {!isCollapsed && 'Class'}
                    </ul>
                </Link>
            </div>

            <div className="user--sidebar" onClick={toggleLogout}>
                <img src="https://via.placeholder.com/50" alt="User" />
                <h6>{username}</h6>
                {showLogout && (
                    <div className="logout--dropdown">
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;