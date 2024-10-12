import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.info}>
                <div>
                    <h1>About</h1>
                    <button>About Us</button>
                    <button>MediCo</button>
                </div>
                <div>
                    <h1>Product</h1>
                    
                    <button>Flashcards</button>
                    <button>Methods</button>
                    <button>Graphs</button>
                    <button>Community</button>
                </div>
                <div>
                    <h1>Help</h1>
                    <button>Support</button>
                    <button>Contact Us</button>
                </div>
            </div>
            <div className={styles.credits}>
                <h6>&copy; 2024 MediCo</h6>
                <h6 className={styles.terms}>Terms</h6>
                <h6>Privacy</h6>
            </div>
        </footer>
    );
}

export default Footer
