import './App.css';
import AuthContainer from './Components/AuthContainer';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './Components/Homepage';
import HomepageAuthTest from './Components/HomepageAuthTest';
import LandingPage from './Components/LandingPage/LandingPage';
import Content from './Components/Dashboard/Content';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />
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
      path: '/dashboard',
      element: <Content />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
