import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";
import '../../styles/authcontainer.css';

const Login = () => {
    return (
        <div className="form-container login">
            <form>
                <h1>Log In</h1>

                <AuthInput type={"text"} placeholder={"Username"}/>
                <AuthInput type={"password"} placeholder={"Password"}/>
                
                <AuthButton buttonText={"LOGIN"}/>
            </form>
        </div>
    )
}

export default Login;