import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const HomeIcon = getIcon('Home');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-6xl sm:text-8xl"
      >
        🎲
      </motion.div>
      
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="text-primary">404</span> - Page Not Found
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Oops! Looks like you've landed on a snake! The page you're looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link 
          to="/" 
          className="btn-primary flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <button 
          onClick={() => window.history.back()} 
          className="btn-outline flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </motion.div>
    </div>
  );
}

export default NotFound;