import AuthButton from "../../UI/AuthButton";
import AuthInput from "../../UI/AuthInput";

const Signup = () => {
    return (
        <div className="form-container signup">
            <form>
                <h1>Sign Up</h1>

                <AuthInput type={"email"} placeholder={"Email"}/>
                <AuthInput type={"text"} placeholder={"Username"}/>
                <AuthInput type={"password"} placeholder={"Password"}/>
                <AuthInput type={"password"} placeholder={"Confirm Password"}/>

                <AuthButton buttonText={"SIGN UP"}/>
            </form>
        </div>
    )
}

export default Signup;