import React from 'react';
import { Icon } from '@iconify/react';
import ae1fb1f23fb01d78d031e5a5aaf92ee0 from '../assets/images/ae1fb1f23fb01d78d031e5a5aaf92ee0.jpg';
import '../assets/styles/user.css';

const User = () => {
    return (
        <div className="user">
            <h2>
                Profile
                <Icon icon="basil:edit-outline" className="icon" />
            </h2>
            <div className="profile--user">
                <img src={ae1fb1f23fb01d78d031e5a5aaf92ee0} alt="User" />
                <h5>@John_Doe</h5>
                <h6>Student</h6>
            </div>
        </div>
    );
};

export default User;
