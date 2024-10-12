import logo from './logo.svg';
import './App.css';
import AuthContainer from './Components/AuthContainer';
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Welcome from './Components/Welcome/Welcome';
import FeatInfo from './Components/FeatInfo/FeatInfo';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Welcome/>
      <FeatInfo/>
      <Footer/>

    </div>
  );
}

export default App;
