import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/greetings.css';
import doctorImage from '../../assets/dd257e9257fae1120be5d13b6b5b7f74.jpg';

const Greetings = () => {

    const [userId, setUserId] = useState(null);
    const [greeting, setGreeting] = useState('');
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
        const determineGreeting = () => {
            const currentHour = new Date().getHours();
            if (currentHour < 12) {
                setGreeting('Good Morning');
            } else if (currentHour < 18) {
                setGreeting('Good Afternoon');
            } else {
                setGreeting('Good Evening');
            }
        };

        determineGreeting();
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
        <div className="greetings--container">
            <div className="greetings--header">
                <div className="routine">
                    <h5 className="greet">{greeting} {username}</h5>
                    <h3 className="greet">Check your Daily Tasks & Schedules</h3>
                </div>
                <div className="humandoctor">
                <img src={doctorImage} alt="human doctor" />
                </div>
            </div>
        </div>
    );
};

export default Greetings;