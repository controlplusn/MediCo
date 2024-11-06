import React from 'react';
import User from './User';
import Calendar from 'react-calendar';
import '../../styles/profile.css';
import ToDoList from './ToDoList';

const Profile = () => {
    return <div className="profile"> 
        <User />
        <Calendar  />
        <ToDoList />
    </div>;

};

export default Profile;