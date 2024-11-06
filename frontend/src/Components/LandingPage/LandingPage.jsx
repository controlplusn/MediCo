import FeatInfo from "./FeatInfo/FeatInfo";
import Footer from "./Footer/Footer";
import NavBar from "./NavBar/NavBar";
import Welcome from "./Welcome/Welcome";
import styles from './Landingpage.module.css'


const LandingPage = () => {
    return (
        <div className={styles.landingPage}>
            <NavBar />
            <Welcome />
            <FeatInfo />
            <Footer />
        </div>

    )
}

export default LandingPage;