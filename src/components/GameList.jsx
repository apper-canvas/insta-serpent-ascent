import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { deleteGame } from '../services/gameService';
import getIcon from '../utils/iconUtils';

function GameList({ games, isLoading, onGameDeleted }) {
  const navigate = useNavigate();
  const [expandedGameId, setExpandedGameId] = useState(null);
  const [deletingGameId, setDeletingGameId] = useState(null);

  const PlayIcon = getIcon('Play');
  const TrashIcon = getIcon('Trash2');
  const EyeIcon = getIcon('Eye');
  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const GamepadIcon = getIcon('Gamepad2');
  const UsersIcon = getIcon('Users');
  const GridIcon = getIcon('Grid');
  const CheckCircleIcon = getIcon('CheckCircle');
  const Loader2Icon = getIcon('Loader2');
  const ChevronDownIcon = getIcon('ChevronDown');
  const ChevronUpIcon = getIcon('ChevronUp');

  const handleDeleteGame = async (gameId) => {
    if (confirm("Are you sure you want to delete this game?")) {
      setDeletingGameId(gameId);
      try {
        await deleteGame(gameId);
        toast.success("Game deleted successfully");
        onGameDeleted();
      } catch (error) {
        console.error("Error deleting game:", error);
        toast.error("Failed to delete game");
      } finally {
        setDeletingGameId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-xl p-8 shadow-card">
        <div className="flex justify-center items-center py-12">
          <Loader2Icon className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-3 text-lg">Loading games...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-100 dark:bg-surface-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Game</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Board Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {games.map((game) => (
              <motion.tr 
                key={game.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-surface-50 dark:hover:bg-surface-750"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-light/20 dark:bg-primary-dark/30 rounded-full flex items-center justify-center">
                      <GamepadIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{game.Name}</div>
                      <button
                        onClick={() => setExpandedGameId(expandedGameId === game.Id ? null : game.Id)}
                        className="text-xs text-primary flex items-center mt-1"
                      >
                        {expandedGameId === game.Id ? 
                          <><ChevronUpIcon className="w-3 h-3 mr-1" /> Less details</> : 
                          <><ChevronDownIcon className="w-3 h-3 mr-1" /> More details</>
                        }
                      </button>
                    </div>
                  </div>
                  {expandedGameId === game.Id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 ml-14 bg-surface-50 dark:bg-surface-750 p-3 rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4 text-surface-500" />
                          <span className="text-xs">Players: <span className="font-medium">2-4</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-surface-500" />
                          <span className="text-xs">Last played: <span className="font-medium">{formatDate(game.ModifiedOn)}</span></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize">{game.game_mode}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <GridIcon className="w-4 h-4 mr-1 text-surface-500" />
                    <span>{game.board_size}x{game.board_size}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${game.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}
                  `}>
                    {game.status === 'completed' ? (
                      <><CheckCircleIcon className="w-3 h-3 mr-1" /> Completed</>
                    ) : (
                      <><ClockIcon className="w-3 h-3 mr-1" /> In Progress</>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-surface-500">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(game.CreatedOn)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/game/${game.Id}`)}
                      className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title={game.status === 'completed' ? 'View Game' : 'Continue Game'}
                    >
                      {game.status === 'completed' ? 
                        <EyeIcon className="w-4 h-4" /> : 
                        <PlayIcon className="w-4 h-4" />
                      }
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.Id)}
                      className={`p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors 
                        ${deletingGameId === game.Id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={deletingGameId === game.Id}
                      title="Delete Game"
                    >
                      {deletingGameId === game.Id ? 
                        <Loader2Icon className="w-4 h-4 animate-spin" /> : 
                        <TrashIcon className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {games.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-surface-600 dark:text-surface-400">No games found.</p>
        </div>
      )}
    </div>
  );
}

export default GameList;