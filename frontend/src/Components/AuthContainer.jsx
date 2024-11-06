import Login from "./Login/Login";
import '../styles/authcontainer.css'
import Signup from "./Signup/Signup";
import ToggleButton from "./ToggleButton";

import React, { useState, useEffect } from 'react';

const AuthContainer = ({ isLogin, activateContainer }) => {
    const[isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (activateContainer) {
            setIsActive(true);
        }
    }, [activateContainer]);

    const handleToggle = () => {
       setIsActive(!isActive);
    }

    return (
        <div className="userContainer-wrapper">
            <div className={`container ${isActive ? 'active' : ''}`} id="container">
                {isLogin ? <Login /> : <Signup />}
                <ToggleButton isActive={isActive} handleToggle={handleToggle} />
            </div>
        </div>
    )
}

export default AuthContainer;