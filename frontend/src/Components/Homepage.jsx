import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div className="homepage">
            <h1>Homepage</h1>

            <Link to="/login">
                <button>Login</button>
            </Link>

            <Link to="/signup">
                <button>Signup</button>
            </Link>
        </div>
    )
}

export default Homepage;