import './App.css';
import AuthContainer from './Components/AuthContainer';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './Components/LandingPage/LandingPage';
import Dashboard from './Components/Dashboard/Dashboard';

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
      element: <Dashboard />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
