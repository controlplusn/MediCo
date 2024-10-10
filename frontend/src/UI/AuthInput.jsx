const AuthInput = ({ type, placeholder, onChange }) => {
    return (
        <input type={type} placeholder={placeholder} onChange={onChange}></input>
    )
}

export default AuthInput;