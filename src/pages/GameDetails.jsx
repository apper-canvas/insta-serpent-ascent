import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import GameBoard from '../components/GameBoard';
import { getGameById } from '../services/gameService';
import { fetchPlayersByGameId } from '../services/playerService';
import { fetchBoardElementsByGameId } from '../services/boardElementService';
import getIcon from '../utils/iconUtils';

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [boardElements, setBoardElements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ArrowLeftIcon = getIcon('ArrowLeft');

  useEffect(() => {
    const loadGameData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const gameData = await getGameById(id);
        if (!gameData) {
          setError("Game not found");
          return;
        }
        
        setGame(gameData);
        
        const [playersData, elementsData] = await Promise.all([
          fetchPlayersByGameId(id),
          fetchBoardElementsByGameId(id)
        ]);
        
        setPlayers(playersData);
        setBoardElements(elementsData);
      } catch (error) {
        console.error("Error loading game data:", error);
        setError("Failed to load game data. Please try again.");
        toast.error("Failed to load game data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGameData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
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
            Loading game...
          </h2>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <motion.h1 
          className="text-2xl md:text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {game.Name}
        </motion.h1>
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${game.status === 'completed' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
        `}>
          {game.status === 'completed' ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card">
          <h3 className="font-medium text-surface-500 dark:text-surface-400 mb-1">Game Mode</h3>
          <p className="font-bold text-lg">{game.game_mode}</p>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card">
          <h3 className="font-medium text-surface-500 dark:text-surface-400 mb-1">Board Size</h3>
          <p className="font-bold text-lg">{game.board_size}x{game.board_size}</p>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card">
          <h3 className="font-medium text-surface-500 dark:text-surface-400 mb-1">Players</h3>
          <p className="font-bold text-lg">{players.length}</p>
        </div>
      </div>

      <GameBoard 
        game={game}
        initialPlayers={players}
        initialBoardElements={boardElements}
        boardSize={parseInt(game.board_size)}
      />
    </div>
  );
}

export default GameDetails;