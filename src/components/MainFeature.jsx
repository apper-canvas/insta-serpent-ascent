import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Game configuration
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: "Player 1", position: 1, color: "#4f46e5" },
    { id: 2, name: "Player 2", position: 1, color: "#10b981" }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameMode, setGameMode] = useState("classic");
  const [showSetup, setShowSetup] = useState(true);
  const [winner, setWinner] = useState(null);
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [boardSize, setBoardSize] = useState(10);

  // Board elements (snakes and ladders)
  const [boardElements, setBoardElements] = useState([]);

  // Icons
  const DiceIcon = getIcon('Dices');
  const FlagIcon = getIcon('Flag');
  const RefreshIcon = getIcon('RefreshCcw');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  const PlayIcon = getIcon('Play');
  const SettingsIcon = getIcon('Settings');
  const UserIcon = getIcon('User');
  const TrophyIcon = getIcon('Trophy');

  // Generate board elements based on game mode
  useEffect(() => {
    const generateBoardElements = () => {
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
        const startPosition = Math.floor(Math.random() * (boardSize * boardSize - 20)) + 2;
        const maxJump = Math.min(20, (boardSize * boardSize) - startPosition - 1);
        const jumpDistance = Math.floor(Math.random() * maxJump) + 5;
        
        ladders.push({
          id: `ladder-${i}`,
          type: "ladder",
          startPosition,
          endPosition: startPosition + jumpDistance,
          color: "#10b981"
        });
      }
      
      // Generate snakes (start is always higher than end)
      for (let i = 0; i < snakeCount; i++) {
        const startPosition = Math.floor(Math.random() * (boardSize * boardSize - 20)) + 20;
        const maxJump = Math.min(20, startPosition - 2);
        const jumpDistance = Math.floor(Math.random() * maxJump) + 5;
        
        snakes.push({
          id: `snake-${i}`,
          type: "snake",
          startPosition,
          endPosition: startPosition - jumpDistance,
          color: "#ef4444"
        });
      }
      
      // Combine and filter out any overlaps
      const elements = [...ladders, ...snakes].filter((element, index, self) => 
        self.findIndex(e => e.startPosition === element.startPosition || e.endPosition === element.startPosition) === index
      );
      
      setBoardElements(elements);
    };
    
    generateBoardElements();
  }, [gameMode, boardSize]);

  // Handle dice roll
  const rollDice = () => {
    if (isRolling || winner) return;
    
    setIsRolling(true);
    
    // Animation effect for dice roll
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // Stop rolling after a delay
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalDiceValue);
      
      // Move the current player
      movePlayer(currentPlayer, finalDiceValue);
      setIsRolling(false);
    }, 1000);
  };

  // Move player logic
  const movePlayer = (playerIndex, steps) => {
    const player = players[playerIndex];
    let newPosition = player.position + steps;
    
    // Check if player won
    if (newPosition >= boardSize * boardSize) {
      setWinner(player);
      toast.success(`${player.name} wins the game!`);
      newPosition = boardSize * boardSize; // Cap at final position
    } else {
      // Check if landed on a snake or ladder
      const element = boardElements.find(el => el.startPosition === newPosition);
      
      if (element) {
        if (element.type === "snake") {
          toast.error(`Oops! ${player.name} got bitten by a snake! Moving down to ${element.endPosition}.`);
          newPosition = element.endPosition;
        } else if (element.type === "ladder") {
          toast.success(`Wow! ${player.name} found a ladder! Climbing up to ${element.endPosition}.`);
          newPosition = element.endPosition;
        }
      }
    }
    
    // Update player position
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex] = { ...player, position: newPosition };
    setPlayers(updatedPlayers);
    
    // Move to next player if game not won
    if (!winner) {
      setCurrentPlayer((currentPlayer + 1) % players.length);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setShowSetup(true);
    setWinner(null);
    setDiceValue(null);
    setCurrentPlayer(0);
    setPlayers(players.map(player => ({ ...player, position: 1 })));
  };

  // Add new player
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
      id: players.length + 1,
      name: playerNameInput,
      position: 1,
      color: colors[players.length % colors.length]
    };
    
    setPlayers([...players, newPlayer]);
    setPlayerNameInput("");
    toast.success(`Added ${playerNameInput} to the game!`);
  };

  // Remove player
  const removePlayer = (id) => {
    if (players.length <= 2) {
      toast.warning("Minimum 2 players required!");
      return;
    }
    
    const updatedPlayers = players.filter(player => player.id !== id);
    setPlayers(updatedPlayers);
  };

  // Start game
  const startGame = () => {
    if (players.length < 2) {
      toast.error("At least 2 players required to start the game!");
      return;
    }
    
    setGameStarted(true);
    setShowSetup(false);
    toast.info("Game started! Roll the dice to make your move.");
  };

  // Generate board cells
  const renderBoard = () => {
    const cells = [];
    const totalCells = boardSize * boardSize;
    
    for (let i = boardSize; i >= 1; i--) {
      const row = [];  
      // Alternate direction for snake-like pattern
      if (i % 2 === 0) {
        // Left to right
        for (let j = 1; j <= boardSize; j++) {
          const cellNumber = (boardSize - i) * boardSize + j;
          row.push(renderCell(cellNumber, totalCells));
        }
      } else {
        // Right to left
        for (let j = boardSize; j >= 1; j--) {
          const cellNumber = (boardSize - i) * boardSize + j;
          row.push(renderCell(cellNumber, totalCells));
        }
      }
      cells.push(
        <motion.div 
          key={`row-${i}`} 
          className="flex"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * (boardSize - i) }}
        >
          {row}
        </motion.div>
      );
    }
    
    return cells;
  };

  // Render individual cell
  const getCellPosition = (number) => {
    const row = Math.ceil(number / boardSize);
    const isEvenRow = row % 2 === 0;
    let col;
    
    if (isEvenRow) {
      col = number - (row - 1) * boardSize;
    } else {
      col = boardSize - (number - (row - 1) * boardSize) + 1;
    }
    
    // Adjust for zero-based indexing
    return { 
      row: boardSize - row, 
      col: col - 1 
    };
  };
  
  // Render visual snakes and ladders
  const renderBoardElements = () => {
    if (!gameStarted) return null;
    
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {boardElements.map(element => {
          const startPos = getCellPosition(element.startPosition);
          const endPos = getCellPosition(element.endPosition);
          
          // Calculate SVG path
          const startX = (startPos.col + 0.5) * (100 / boardSize) + '%';
          const startY = (startPos.row + 0.5) * (100 / boardSize) + '%';
          const endX = (endPos.col + 0.5) * (100 / boardSize) + '%';
          const endY = (endPos.row + 0.5) * (100 / boardSize) + '%';
          
          // Create a curved path
          const curveX = ((parseFloat(startX) + parseFloat(endX)) / 2) + '%';
          const curveY = ((parseFloat(startY) + parseFloat(endY)) / 2 - 5) + '%';
          
          const pathClass = element.type === 'snake' ? 'snake-path' : 'ladder-path';
          const pathD = element.type === 'snake' 
            ? `M ${startX} ${startY} Q ${curveX} ${curveY}, ${endX} ${endY}` 
            : `M ${startX} ${startY} L ${endX} ${endY}`;
          
          return <path key={element.id} className={pathClass} d={pathD} />;
        })}
      </div>
    );
  };
  
  const renderCell = (number, totalCells) => {
    return (
      <motion.div
        key={`cell-${number}`}
        className={`game-cell ${(() => {
          // Determine cell class based on type
          let cellClass = number % 2 === 0 ? "cell-even" : "cell-odd";
          
          // Determine if this cell has a snake or ladder
          const snakeStart = boardElements.find(el => el.type === "snake" && el.startPosition === number);
          const ladderStart = boardElements.find(el => el.type === "ladder" && el.startPosition === number);
          
          if (snakeStart) cellClass = "snake-cell";
          if (ladderStart) cellClass = "ladder-cell";
          
          // Special styling for start and finish
          if (number === 1) cellClass = "start-cell";
          if (number === totalCells) cellClass = "finish-cell";
          
          return cellClass;
        })()}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.01 * number }}
      >
        <span className="z-10 relative">{number}</span>
        {/* Cell icons */}
        {number === 1 && <PlayIcon className="absolute top-0 right-0 w-3 h-3 text-blue-600" />}
        {number === totalCells && <TrophyIcon className="absolute top-0 right-0 w-3 h-3 text-purple-600" />}
        {boardElements.find(el => el.type === "snake" && el.startPosition === number) && 
          <ArrowDownIcon className="absolute top-0 right-0 w-3 h-3 text-red-600 animate-pulse" />}
        {boardElements.find(el => el.type === "ladder" && el.startPosition === number) && 
          <ArrowUpIcon className="absolute top-0 right-0 w-3 h-3 text-green-600 animate-pulse" />}
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex flex-wrap gap-1 justify-center">
            {players.map((player, index) => 
              player.position === number && (
                <motion.div
                  key={`player-${player.id}-pos-${number}`}
                  className={`player-token ${currentPlayer === index && !winner ? 'active-player' : ''}`}
                  style={{ backgroundColor: player.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                >
                  {player.id}
                </motion.div>
              )
            )}
          </div>
        </div>
      </motion.div>
    );
  };

                      </div>
    return (
      <motion.div 
        className={`dice ${isRolling ? 'dice-rolling' : ''}`}
        onClick={rollDice}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isRolling ? { 
          rotate: [0, 15, 0, -15, 0],
          y: [0, -10, 0, -5, 0]
        } : {}}
        transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}>
        {value ? (
          <>
            {/* Render dice dots based on value */}
            {value === 1 && <div className="dice-dot" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>}
            
            {value >= 2 && (
              <>
                <div className="dice-dot" style={{ top: '25%', left: '25%' }}></div>
                <div className="dice-dot" style={{ bottom: '25%', right: '25%' }}></div>
              </>
            )}
            
            {value >= 3 && (
              <div className="dice-dot" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
            )}
            
            {value >= 4 && (
              <>
                <div className="dice-dot" style={{ top: '25%', right: '25%' }}></div>
                <div className="dice-dot" style={{ bottom: '25%', left: '25%' }}></div>
              </>
            )}
            
            {value === 6 && (
              <>
                <div className="dice-dot" style={{ top: '50%', left: '25%', transform: 'translateY(-50%)' }}></div>
                <div className="dice-dot" style={{ top: '50%', right: '25%', transform: 'translateY(-50%)' }}></div>
              </>
            )}
          </>
        ) : (
          <DiceIcon className="w-6 h-6 text-primary" />
    </motion.div>
  );
};
  };
  
  return (
    <div className="mb-16">
      <div className="card overflow-visible">
        <div className="bg-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold">Snake and Ladder</h2>
          <div className="flex gap-2">
            {gameStarted ? (
              <button 
                onClick={() => setShowSetup(!showSetup)} 
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                title="Game Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            ) : null}
            <button 
              onClick={resetGame} 
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="Reset Game"
            >
              <RefreshIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {showSetup && (
            <motion.div 
              className="p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4">Game Setup 🎮</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Game Mode
                  </label>
                  <select 
                    className="select"
                    value={gameMode}
                    onChange={(e) => setGameMode(e.target.value)}
                    disabled={gameStarted}
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
                    onChange={(e) => setBoardSize(Number(e.target.value))}
                    disabled={gameStarted}
                  >
                    <option value="8">8x8 (Beginner)</option>
                    <option value="10">10x10 (Classic)</option>
                    <option value="12">12x12 (Advanced)</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Players 👥</h4>
                <div className="space-y-3">
                  {players.map(player => (
                    <div 
                      key={player.id} 
                      className="flex items-center bg-surface-100 dark:bg-surface-800 p-3 rounded-lg"
                    >
                      <div 
                        className="w-6 h-6 rounded-full mr-3" 
                        style={{ backgroundColor: player.color }}
                      ></div>
                      <span className="flex-grow">{player.name}</span>
                      <button 
                        onClick={() => removePlayer(player.id)}
                        className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                        disabled={gameStarted || players.length <= 2}
                      >
                        <TrashIcon className="w-4 h-4 text-surface-500" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {!gameStarted && players.length < 4 && (
                  <div className="flex gap-2 mt-3">
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
                      onClick={addPlayer}
                      className="btn-secondary"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              {!gameStarted && (
                <div className="mt-6 text-center">
                  <button 
                    onClick={startGame}
                    className="btn-primary px-8 py-3 text-lg flex items-center justify-center gap-2 mx-auto"
                  >
                    <PlayIcon className="w-5 h-5" />
                    Start Game
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {gameStarted && (
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              {/* Game Board */}
              <div className="order-2 md:order-1 flex-grow">
                <div className="bg-surface-100 dark:bg-surface-800 border-2 border-surface-300 dark:border-surface-700 rounded-xl overflow-hidden shadow-xl">
                  <div className="relative">
                    {/* Board title banner */}
                    <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-bold z-10">
                      Snake and Ladder Board
                    </div>
                    
                    {/* SVG container for snakes and ladders */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {renderBoardElements()}
                    </svg>
                    
                    <div className="board pt-6" style={{ 
                      width: '100%', aspectRatio: '1/1', maxHeight: 'calc(100vh - 300px)',
                    }}>
                      {renderBoard()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Game Controls */}
              <div className="order-1 md:order-2 md:w-64 lg:w-80">
                <div className="card p-4">
                  {winner ? (
                    <motion.div 
                      className="text-center p-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div className="text-6xl mb-4" animate={{ rotate: [0, 10, 0, -10, 0] }} 
                       transition={{ duration: 2, repeat: Infinity }}>
                        🏆</motion.div>
                      <h3 className="text-xl font-bold text-primary mb-2">
                        {winner.name} Wins!
                      </h3>
                      <p className="text-surface-600 dark:text-surface-400 mb-4">
                        Congratulations on reaching the top!
                      </p>
                      <button 
                        onClick={resetGame}
                        className="btn-primary w-full"
                      >
                        Play Again
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        Current Turn: <span className="font-bold" style={{ color: players[currentPlayer].color }}>
                          {players[currentPlayer].name}
                        </span>
                      </h3>
                      
                      <div className="flex justify-center mb-6">
                        {renderDice(diceValue)}
                      </div>
                      
                      <button 
                        onClick={rollDice}
                        disabled={isRolling}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        <DiceIcon className="w-5 h-5" />
                        {isRolling ? "Rolling..." : "Roll Dice"}
                      </button>
                      
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium flex items-center gap-1">
                          <FlagIcon className="w-4 h-4" /> Player Positions:
                        </h4>
                        {players.map((player, index) => (
                          <motion.div 
                            key={`pos-${player.id}`} 
                            className={`flex items-center p-2 rounded-lg ${currentPlayer === index && !winner ? 'bg-surface-200 dark:bg-surface-700' : ''}`}
                            animate={currentPlayer === index && !winner ? { x: [0, 3, 0, -3, 0] } : {}}
                            transition={{ duration: 0.5, repeat: currentPlayer === index && !winner ? Infinity : 0, repeatType: 'loop' }}
                          >
                            <div 
                              className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold border-2 border-white`}
                              style={{ backgroundColor: player.color }}
                            >
                              {player.id}
                            </div>
                            <span className="text-sm flex-grow">
                              {player.name}: <span className="font-medium">{player.position}</span> / {boardSize * boardSize}
                            </span>
                            {currentPlayer === index && !isRolling && !winner && (
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;