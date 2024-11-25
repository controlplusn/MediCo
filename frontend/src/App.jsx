import './App.css';
import AuthContainer from './Components/AuthContainer';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import LandingPage from './Components/LandingPage/LandingPage';
import Dashboard from './Components/Dashboard/Dashboard';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Community from './Components/Community/Community';
import Flashcard from './Components/Flashcards/Flashcard';
import MainFlashCardLearn from './Components/FlashcardsLearn/MainFlashCardLearn';
import AddCard from './Components/AddFlashcard/AddCard';
import Class from './Components/Class/Class';
import ClassPageContent from './Components/Class/ClassPageContent/ClassPageContent';

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children;

}


// redirect authenticated user to the landing page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}


function App() {
  const {isCheckingAuth, checkAuth, isAuthenticated, user} = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log("isAuthenticated", isAuthenticated);
  console.log("isCheckingAuth:", isCheckingAuth);
  console.log("user", user);
  

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <LandingPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/login', 
      element: (
        <RedirectAuthenticatedUser>
          <AuthContainer isLogin={true} activateContainer={false} />
        </RedirectAuthenticatedUser>
      )
    },
    {
      path: '/signup',
      element: (
        <RedirectAuthenticatedUser>
          <AuthContainer isLogin={false} activateContainer={true} />
        </RedirectAuthenticatedUser>
      )
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )
    },
    {
      path: '/community',
      element: (
        <ProtectedRoute>
          <Community username={"helloWorld"} />
        </ProtectedRoute>
      )
    },
    {
      path: '/flashcards',
      element: (
        <ProtectedRoute>
          <Flashcard />
        </ProtectedRoute>
      )
    },
    {
      path: '/flashcardcontent/:categoryId',
      element: (
        <ProtectedRoute>
          <MainFlashCardLearn />
        </ProtectedRoute>
      )
    },
    {
      path: '/flashcardcollection/:categoryId/:subsetId',
      element: (
        <ProtectedRoute>
          <AddCard />
        </ProtectedRoute>
      )
    },
    {
      path: '/class',
      element: (
        <ProtectedRoute>
          <Class />
        </ProtectedRoute>
      )
    },
    {
      path: '/class/classcontent',
      element: (
        <ProtectedRoute>
          <ClassPageContent />
        </ProtectedRoute>
      )
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
