import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import '../../styles/authcontainer.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";

const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const { login, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await login(username, password);
        navigate('/dashboard');
    }

    return (
        <div className="form-container login">
            <form onSubmit={handleSubmit}>
                <h1>Log In</h1>

                <AuthInput type={"text"} placeholder={"Username"} onChange={(e) => setUsername(e.target.value)} />
                <AuthInput type={"password"} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />
                
                <AuthButton buttonText={"LOGIN"}/>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default Login;