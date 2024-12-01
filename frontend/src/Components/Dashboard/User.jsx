import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import profileImg from '../../assets/ae1fb1f23fb01d78d031e5a5aaf92ee0.jpg';
import '../../styles/user.css'

const User = () => {
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

    return (
        <div className="user">
            <h2>
                Profile
                <Icon icon="basil:edit-outline" className="icon" />
            </h2>
            <div className="profile--user">
                <img src={profileImg} alt="User" />
                <h5>@{username}</h5>
            </div>
        </div>
    );
};

export default User;