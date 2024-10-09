import '../styles/authbutton.css'

const AuthButton = ({ classText, buttonText }) => {
    return (
        <div className="authButton">
            <button className={classText}>{buttonText}</button>
        </div>
    )
}

export default AuthButton;