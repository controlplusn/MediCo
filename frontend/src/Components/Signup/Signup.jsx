import { useState } from "react";
import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import '../../styles/authcontainer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/signup', {email, username, password})
        .then(result => {console.log(result)
            navigate('/login');
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="form-container signup">
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>

                <AuthInput type={"email"} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)} />
                <AuthInput type={"text"} placeholder={"Username"} onChange={(e) => setUsername(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Confirm Password"} onChange={(e) => setPassword(e.target.value)} />
             
                <AuthButton buttonText={"SIGN UP"}/>
            </form>
        </div>
    )
}

export default Signup;