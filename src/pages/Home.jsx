import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Icons
  const InfoIcon = getIcon('Info');
  const TrophyIcon = getIcon('Trophy');
  const UsersIcon = getIcon('Users');
  
  useEffect(() => {
    // Simulate loading the game resources
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome to Serpent Ascent! Roll the dice to start your journey.");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
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
          Loading your adventure...
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 text-center">
        <motion.h1 
          className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Climb to Victory in <span className="text-primary">Snake and Ladder</span>
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The classic Snake and Ladder game reimagined for the digital age.
          Navigate the treacherous board, avoid the serpents, and race to the top!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
              <InfoIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">How to Play</h3>
          </div>
          <ul className="space-y-2 text-surface-600 dark:text-surface-400">
            <li>• Roll the dice to determine your moves</li>
            <li>• Climb ladders to advance quickly</li>
            <li>• Avoid snakes that will send you back</li>
            <li>• First player to reach 100 wins!</li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary-light/20 flex items-center justify-center mr-4">
              <TrophyIcon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">Game Modes</h3>
          </div>
          <ul className="space-y-2 text-surface-600 dark:text-surface-400">
            <li>• Classic: Traditional 10x10 board</li>
            <li>• Speed: More ladders, fewer snakes</li>
            <li>• Challenge: More snakes, fewer ladders</li>
            <li>• Custom: Design your own board layout</li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mr-4">
              <UsersIcon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold">Multiplayer</h3>
          </div>
          <ul className="space-y-2 text-surface-600 dark:text-surface-400">
            <li>• Play with up to 4 friends</li>
            <li>• Personalize your game tokens</li>
            <li>• Track game history and stats</li>
            <li>• Earn achievements as you play</li>
          </ul>
        </motion.div>
      </div>

      <MainFeature />
    </div>
  );
}

export default Home;