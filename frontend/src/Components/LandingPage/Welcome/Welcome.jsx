import styles from './Welcome.module.css'
import wc from './Image/wc.png';

const Welcome = () => {
    return(
        <section className={styles.wc}>
            <div className={styles.right}>
                <h1>
                    The platform created specifically for medical students to simplify learning.
                </h1>
                <button className={styles.btn}>
                    Get Started
                </button>
            </div>
            <div className={styles.left}>
                <img className={styles.welcomeImg} src={"https://placehold.co/500x500/000000/FFFFFF/png"} alt='Welcome Image'></img>
            </div>
        </section>
    );
}

export default Welcome;