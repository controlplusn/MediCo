import React from 'react';
import User from './User';
import Calendar from 'react-calendar';
import '../../styles/profile.css';
import ToDoList from './ToDoList';

const Profile = () => {
    return <div className="profile"> 
        <User />
        <Calendar  />
        <ToDoList userId="672cb19af16ce3b2613900d5" />
    </div>;

};

export default Profile;