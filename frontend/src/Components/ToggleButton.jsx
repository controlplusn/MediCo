import AuthButton from "../UI/AuthButton";

const ToggleButton = ({ isActive, handleToggle }) => {
    return (
        <div className="toggle-container">
            <div className="toggle">
                <div className="toggle-panel toggle-right">
                    {/* img icon */}
                    <p>Start your journey with us and sign up now</p>
                    <AuthButton 
                        className={"hidden"} 
                        buttonText={"SIGN IN"}
                        onClick={() => handleToggle()}
                    />
                </div>
                <div className="toggle-panel toggle-left">
                    {/* img icon */}
                    <p>Already have an account?</p>
                    <AuthButton 
                        className={"hidden"} 
                        buttonText={"LOG IN"}
                        onClick={() => handleToggle()}
                    />
                </div>
            </div>
        </div>
    )
}

export default ToggleButton;