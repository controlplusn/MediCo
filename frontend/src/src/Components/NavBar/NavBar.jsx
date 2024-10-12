import styles from './NavBar.module.css'
import logo from './Image/logo.png';
function NavBar(){
    return(
        <nav>
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
                <button className={styles.signUp}>
                    Sign In
                </button>

                <button className={styles.login}>
                    Log In
                </button>
            </div>

        </nav>
    );
}

export default NavBar