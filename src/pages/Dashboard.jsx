import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import GameList from '../components/GameList';
import NewGame from '../components/NewGame';
import { fetchGames } from '../services/gameService';
import getIcon from '../utils/iconUtils';

function Dashboard() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewGameForm, setShowNewGameForm] = useState(false);
  const { user } = useSelector((state) => state.user);

  const PlusIcon = getIcon('Plus');
  const RefreshIcon = getIcon('RefreshCcw');
  const GamepadIcon = getIcon('Gamepad2');

  const loadGames = async () => {
    setIsLoading(true);
    try {
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to load games. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <motion.h1 
          className="mb-4 text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, <span className="text-primary">{user?.firstName || 'Player'}</span>!
        </motion.h1>
        <motion.p 
          className="text-lg text-surface-600 dark:text-surface-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Manage your Snake and Ladder games and track your progress.
        </motion.p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GamepadIcon className="w-6 h-6 text-primary" />
          Your Games
        </h2>
        <div className="flex gap-2">
          <button
            onClick={loadGames}
            className="btn-secondary flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowNewGameForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            New Game
          </button>
        </div>
      </div>

      {showNewGameForm && (
        <NewGame
          onClose={() => setShowNewGameForm(false)}
          onGameCreated={() => {
            setShowNewGameForm(false);
            loadGames();
          }}
        />
      )}

      <GameList 
        games={games} 
        isLoading={isLoading} 
        onGameDeleted={loadGames}
      />

      {!isLoading && games.length === 0 && !showNewGameForm && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">🎲</div>
          <h3 className="text-xl font-medium mb-4">No games yet</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            Create your first Snake and Ladder game to get started!
          </p>
          <button
            onClick={() => setShowNewGameForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create Game
          </button>
        </motion.div>
      )}

      <div className="mt-12 bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4">About Snake and Ladder</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-4">
          Snake and Ladder is a classic board game that combines luck and suspense. Navigate through a board filled with
          ladders that help you climb up and snakes that bring you down.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Classic Mode</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Traditional 10x10 board with balanced snakes and ladders.
            </p>
          </div>
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Speed Mode</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              More ladders, fewer snakes for faster gameplay.
            </p>
          </div>
          <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Challenge Mode</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              More snakes, fewer ladders for a true challenge.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link to="/" className="text-primary hover:text-primary-dark font-medium">
            Learn more about the game →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;