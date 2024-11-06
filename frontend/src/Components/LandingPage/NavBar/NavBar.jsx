import styles from './NavBar.module.css'
import logo from './Image/logo.png';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return(
        <nav className={styles.navbar}>
            <div className={styles.left}>
                <img className={styles.logo} src={logo} alt='MediCo'></img>
                <h3>MediCo</h3>
            </div>
            <div className={styles.middle}>
                <button className={styles.btnMid}>
                    Home
                </button>

                <button className={styles.btnMid}>
                    Features
                </button>

                <button className={styles.btnMid}>
                    Contact
                </button>
            </div>
            <div className={styles.right}>
                <Link to="/signup">
                    <button className={styles.signUp}>
                        Sign Up
                    </button>
                </Link>

                <Link to="/login">
                    <button className={styles.login}>
                        Log In
                    </button>
                </Link>
            </div>

        </nav>
    );
}

export default NavBar;