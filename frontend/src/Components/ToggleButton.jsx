import AuthButton from "../UI/AuthButton";
import { useNavigate } from 'react-router-dom';

const ToggleButton = ({ isActive, handleToggle }) => {
    const navigate = useNavigate();

    const handleLoginNav = () => {
        navigate('/login');
    }

    const handleSignupNav = () => {
        navigate('/signup');
    }

    return (
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-right">
                    {/* img icon */}
                    <p>Start your journey with us and sign up now</p>
                    <AuthButton 
                        className={"hidden"} 
                        buttonText={"SIGN UP"}
                        onClick={() => {
                            handleToggle();
                            handleSignupNav();
                        }}
                    />
                </div>
                <div className="toggle-panel toggle-left">
                    {/* img icon */}
                    <p>Already have an account?</p>
                    <AuthButton 
                        className={"hidden"} 
                        buttonText={"LOG IN"}
                        onClick={() => {
                            handleToggle();
                            handleLoginNav();
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ToggleButton;