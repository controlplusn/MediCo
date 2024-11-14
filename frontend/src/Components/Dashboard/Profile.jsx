import React, { useEffect, useState } from 'react';
import User from './User';
import Calendar from 'react-calendar';
import '../../styles/profile.css';
import ToDoList from './ToDoList';

const Profile = () => {
    const [ userId, setUserId ] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);


    return <div className="profile"> 
        <User />
        <Calendar  />
        {userId ? <ToDoList userId={userId} /> : <p>Loading tasks...</p>}
    </div>;

};

export default Profile;