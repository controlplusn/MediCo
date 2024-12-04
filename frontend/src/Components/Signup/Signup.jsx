import { useState } from "react";
import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import '../../styles/authcontainer.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const navigate = useNavigate();

    const { signup, error } = useAuthStore();

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        setLocalError('');

        try {
            await signup(email, username, password);
            navigate('/login');

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="form-container signup">
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>

                <AuthInput type={"email"} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)} />
                <AuthInput type={"text"} placeholder={"Username"} onChange={(e) => setUsername(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Confirm Password"} onChange={(e) => setConfirmPassword(e.target.value)} />
             
                <AuthButton buttonText={"SIGN UP"}/>
                
                {localError && <p className="error">{localError}</p>}

                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default Signup;