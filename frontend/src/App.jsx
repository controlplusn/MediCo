import './App.css';
import AuthContainer from './Components/AuthContainer';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './Components/Homepage';
import HomepageAuthTest from './Components/HomepageAuthTest';
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import Welcome from './Components/Welcome/Welcome';
import FeatInfo from './Components/FeatInfo/FeatInfo';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Homepage />
    },
    {
      path: '/login',
      element: <AuthContainer isLogin={true} activateContainer={false} />
    },
    {
      path: '/signup',
      element: <AuthContainer isLogin={false} activateContainer={true} />
    },
    {
      path: '/homepage',
      element: <HomepageAuthTest />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
