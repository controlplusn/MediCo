import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import '../../styles/authcontainer.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/auth/login', {username, password})
            .then(result => {
                console.log(result)
                navigate('/dashboard');
            })
            .catch(err => {
                console.log(err);
                console.log('Login failed. Please try again');
            });
    }

    return (
        <div className="form-container login">
            <form onSubmit={handleSubmit}>
                <h1>Log In</h1>

                <AuthInput type={"text"} placeholder={"Username"} onChange={(e) => setUsername(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
                
                <AuthButton buttonText={"LOGIN"}/>
            </form>
        </div>
    )
}

export default Login;