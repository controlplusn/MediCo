import { useEffect, useState } from "react";
import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import '../../styles/authcontainer.css';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';


const API_URL = "http://localhost:3001/api/auth";
axios.defaults.withCredentials = true;

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // check auth status
    const checkAuth = async () => {
        setIsCheckingAuth(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            setUser(response.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            console.error("Authentication check failed: ", err);
            setIsAuthenticated(false);
        } finally {
            setIsCheckingAuth(false);
        }
    };

    // call checkAuth
    useEffect(() => {
        checkAuth();
    }, []);

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if (password !== confirmPassword) {
            console.log('Passwords do not match');
        }

        setError(null);

        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                username,
                password
            });

            console.log("Signup successful:", response.data);
            setUser(response.data.user);
            setIsAuthenticated(true);
            navigate('/login');

        } catch (err) {
            setError(err.response?.data?.message || "Error signing up");
            console.error(err);
        }
    };

    // Protect routes that require authentication
    if (isCheckingAuth) {
        return <div>Loading...</div>
    }

    // Go back to landing page when user is authenticated
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="form-container signup">
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                {error && <p className="error">{error}</p>}

                <AuthInput type={"email"} placeholder={"Email"} onChange={(e) => setEmail(e.target.value)} />
                <AuthInput type={"text"} placeholder={"Username"} onChange={(e) => setUsername(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Confirm Password"} onChange={(e) => setConfirmPassword(e.target.value)} />
             
                <AuthButton buttonText={"SIGN UP"}/>
            </form>
        </div>
    )
}

export default Signup;