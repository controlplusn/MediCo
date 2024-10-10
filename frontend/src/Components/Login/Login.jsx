import { useState, useEffect } from 'react';
import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import axios from 'axios';

const Login = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState();
    const [age, setAge] = useState();
    
    useEffect(() => {
        axios.get('http://localhost:3000/getUsers')
        .then((users) => {
            setUsers(users.data)
        }).catch(err => console.log(err));
    }, []);

    return (
        <div className="form-container login">
            <form>
                <h1>Log In</h1>

                <AuthInput type={"text"} placeholder={"Username"} onChange={(e) => setName(e.target.value)}/>
                <AuthInput type={"password"} placeholder={"Password"} onChange={(e) => setAge(e.target.value)}/>

                <AuthButton buttonText={"LOGIN"}/>
            </form>
        </div>
    )
}

export default Login;