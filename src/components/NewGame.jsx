import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createGame } from '../services/gameService';
import { createPlayer } from '../services/playerService';
import { createBoardElement } from '../services/boardElementService';
import getIcon from '../utils/iconUtils';

function NewGame({ onClose, onGameCreated }) {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [gameMode, setGameMode] = useState('classic');
  const [boardSize, setBoardSize] = useState('10');
  const [players, setPlayers] = useState([
    { name: "Player 1", color: "#4f46e5" },
    { name: "Player 2", color: "#10b981" }
  ]);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const XIcon = getIcon('X');
  const UserIcon = getIcon('User');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const LoaderIcon = getIcon('Loader2');

  const addPlayer = () => {
    if (players.length >= 4) {
      toast.warning("Maximum 4 players allowed!");
      return;
    }
    
    if (!playerNameInput.trim()) {
      toast.error("Please enter a player name!");
      return;
    }
    
    const colors = ["#4f46e5", "#10b981", "#f97316", "#8b5cf6"];
    const newPlayer = {
      name: playerNameInput,
      color: colors[players.length % colors.length]
    };
    
    setPlayers([...players, newPlayer]);
    setPlayerNameInput("");
  };

  const removePlayer = (index) => {
    if (players.length <= 2) {
      toast.warning("Minimum 2 players required!");
      return;
    }
    
    const updatedPlayers = [...players];
    updatedPlayers.splice(index, 1);
    setPlayers(updatedPlayers);
  };

  const generateBoardElements = (gameId, boardSize) => {
    const snakes = [];
    const ladders = [];
    
    // Different configurations based on game mode
    let snakeCount = 8;
    let ladderCount = 8;
    
    if (gameMode === "speed") {
      snakeCount = 5;
      ladderCount = 12;
    } else if (gameMode === "challenge") {
      snakeCount = 12;
      ladderCount = 5;
    }
    
    // Generate ladders (start is always lower than end)
    for (let i = 0; i < ladderCount; i++) {
      const boardSizeNum = parseInt(boardSize);
      const startPosition = Math.floor(Math.random() * (boardSizeNum * boardSizeNum - 20)) + 2;
      const maxJump = Math.min(20, (boardSizeNum * boardSizeNum) - startPosition - 1);
      const jumpDistance = Math.floor(Math.random() * maxJump) + 5;
      
      ladders.push({
        Name: `Ladder ${i+1}`,
        type: "ladder",
        start_position: startPosition,
        end_position: startPosition + jumpDistance,
        game_id: gameId
      });
    }
    
    // Generate snakes (start is always higher than end)
    for (let i = 0; i < snakeCount; i++) {
      const boardSizeNum = parseInt(boardSize);
      const startPosition = Math.floor(Math.random() * (boardSizeNum * boardSizeNum - 20)) + 20;
      const maxJump = Math.min(20, startPosition - 2);
      const jumpDistance = Math.floor(Math.random() * maxJump) + 5;
      
      snakes.push({
        Name: `Snake ${i+1}`,
        type: "snake",
        start_position: startPosition,
        end_position: startPosition - jumpDistance,
        game_id: gameId
      });
    }
    
    // Combine and filter out any overlaps
    const elements = [...ladders, ...snakes].filter((element, index, self) => 
      self.findIndex(e => e.start_position === element.start_position || e.end_position === element.start_position) === index
    );
    
    return elements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gameName.trim()) {
      toast.error("Please enter a game name");
      return;
    }
    
    if (players.length < 2) {
      toast.error("At least 2 players are required");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Create the game
      const gameData = {
        Name: gameName,
        game_mode: gameMode,
        board_size: boardSize,
        status: 'in_progress'
      };
      
      const createdGame = await createGame(gameData);
      const gameId = createdGame.Id;
      
      // Create players
      for (let i = 0; i < players.length; i++) {
        const playerData = {
          Name: players[i].name,
          position: 1,
          color: players[i].color,
          game_id: gameId
        };
        await createPlayer(playerData);
      }
      
      // Generate and create board elements
      const boardElements = generateBoardElements(gameId, boardSize);
      
      for (const element of boardElements) {
        await createBoardElement(element);
      }
      
      toast.success("Game created successfully!");
      
      if (onGameCreated) {
        onGameCreated();
      }
      
      // Navigate to the new game
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error("Error creating game:", error);
      toast.error("Failed to create game. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mb-8 bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create New Game</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Game Name*
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter game name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
              maxLength={50}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Game Mode
            </label>
            <select 
              className="select"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
            >
              <option value="classic">Classic</option>
              <option value="speed">Speed (More Ladders)</option>
              <option value="challenge">Challenge (More Snakes)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Board Size
            </label>
            <select 
              className="select"
              value={boardSize}
              onChange={(e) => setBoardSize(e.target.value)}
            >
              <option value="8">8x8 (Beginner)</option>
              <option value="10">10x10 (Classic)</option>
              <option value="12">12x12 (Advanced)</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-3">Players (2-4)</h3>
          <div className="space-y-3 mb-4">
            {players.map((player, index) => (
              <div 
                key={index} 
                className="flex items-center bg-surface-100 dark:bg-surface-800 p-3 rounded-lg"
              >
                <div 
                  className="w-6 h-6 rounded-full mr-3" 
                  style={{ backgroundColor: player.color }}
                ></div>
                <span className="flex-grow">{player.name}</span>
                <button 
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                  disabled={players.length <= 2}
                >
                  <TrashIcon className="w-4 h-4 text-surface-500" />
                </button>
              </div>
            ))}
          </div>
          
          {players.length < 4 && (
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Enter player name"
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  maxLength={15}
                />
              </div>
              <button 
                type="button"
                onClick={addPlayer}
                className="btn-secondary"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                Creating...
              </>
            ) : 'Create Game'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default NewGame;