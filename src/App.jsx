import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GameDetails from './pages/GameDetails';
import NotFound from './pages/NotFound';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const UserIcon = getIcon('User');
  const LogOutIcon = getIcon('LogOut');

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function(user) {
        // Store user data in Redux store
        let currentPath = window.location.pathname + window.location.search;
        if (user && user.isAuthenticated) {
          dispatch(setUser(user));
          if (currentPath.includes('login') || currentPath.includes('signup')) {
            navigate('/dashboard');
          } else {
            navigate(currentPath);
          }
        } else if (!currentPath.includes('login')) {
          navigate('/login');
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 0, 180, 180, 0],
              scale: [1, 1.2, 1.2, 1, 1]
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            🎲
          </motion.div>
          <h2 className="text-xl font-medium text-surface-600 dark:text-surface-400">
            Initializing application...
          </h2>
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="text-3xl text-accent"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                🎲
              </motion.div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Snake and Ladder
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div className="flex items-center mr-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline-block">
                    {userState.user?.firstName || 'User'}
                  </span>
                </div>
              )}
              
              {isAuthenticated && (
                <button 
                  onClick={authMethods.logout}
                  className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogOutIcon className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                </button>
              )}
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? 
                  <SunIcon className="w-5 h-5 text-yellow-400" /> : 
                  <MoonIcon className="w-5 h-5 text-surface-600" />
                }
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          <Routes>
            {/* Public routes - accessible when NOT authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
            </Route>
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/game/:id" element={<GameDetails />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-4">
          <div className="container mx-auto px-4 text-center text-sm text-surface-500">
            <p>© 2023 Snake and Ladder. All rights reserved.</p>
          </div>
        </footer>
        
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastClassName="rounded-xl shadow-soft"
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;