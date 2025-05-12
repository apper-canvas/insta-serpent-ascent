import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const HomeIcon = getIcon('Home');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-9xl mb-6"
      >
        🎲
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl font-bold mb-4 text-center"
      >
        Page Not Found
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xl text-surface-600 dark:text-surface-400 mb-8 text-center max-w-lg"
      >
        Oops! Looks like you rolled outside the board. The page you're looking for doesn't exist.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="btn-primary flex items-center gap-2"
        >
          {isAuthenticated ? <ArrowLeftIcon className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
          {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;