import Login from "./Login/Login";
import '../styles/authcontainer.css'
import Signup from "./Signup/Signup";
import ToggleButton from "./ToggleButton";

import React, {useState} from 'react';

const AuthContainer = () => {
    const[isActive, setIsActive] = useState(false);

    const handleToggle = () => {
       setIsActive(!isActive);
    }

    return (
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            <Login />
            <Signup />
            <ToggleButton isActive={isActive} handleToggle={handleToggle} />
        </div>
    )
}

export default AuthContainer;