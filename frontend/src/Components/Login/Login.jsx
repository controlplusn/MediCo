import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";

const Login = () => {
    return (
        <div className="login-container login">
            <form>
                <h1>Log In</h1>

                <AuthInput type={"text"} placeholder={"Username"}/>
                <AuthInput type={"password"} placeholder={"Password"}/>

                <AuthButton buttonText={"LOGIN"}/>
            </form>

            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel">
                        {/* img icon */}
                        <p>Start your journey with us and sign up now</p>
                        <AuthButton className={"hidden"} buttonText={"SIGN IN"}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;