const AuthButton = ({ classText, buttonText, onClick }) => {
    return (
        <div className="authButton">
            <button className={classText} onClick={onClick}>
                {buttonText}
            </button>
        </div>
    )
}

export default AuthButton;