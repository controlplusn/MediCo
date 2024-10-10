import { useState, useEffect } from 'react';
import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";

const Signup = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState();
    const [age, setAge] = useState();

    useEffect(() => {
        axios.get('http://localhost:3000/getUsers')
        .then((users) => {
            setUsers(users.data)
        }).catch(err => console.log(err));
    }, []);

    const Submit =() => {
        axios.post('http://localhost:3000/createUser', {name, age})
        .then((users) => {
            console.log(users);
        }).catch(err => console.log(err));
    }

    return (
        <div className="form-container signup">
            <form>
                <h1>Sign Up</h1>

                <AuthInput type={"email"} placeholder={"Email"}/>
                <AuthInput type={"text"} placeholder={"Username"}/>
                <AuthInput type={"password"} placeholder={"Password"}/>
                <AuthInput type={"password"} placeholder={"Confirm Password"}/>

                <AuthButton buttonText={"SIGN UP"} onClick={Submit}/>
            </form>
        </div>
    )
}

export default Signup;