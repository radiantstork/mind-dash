import React, { useState, useEffect, useCallback } from 'react';
import '../ChimpTest.css';
import { Tile } from "../types/games.ts";
import customFetch from "../services/custom_fetch.ts";
import GameStats from "./GameStats.tsx";
import ResultsScreen from '../components/ResultsScreen/ResultsScreen.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { catchAxiosError } from '../services/catch_axios_error.ts';

const ChimpTest: React.FC = () => {
  const [gameState, setGameState] = useState<'ready' | 'memorize' | 'recall' | 'finished'>('ready');
  const [level, setLevel] = useState(4); // Start with 4 tiles
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  // const [highScores, setHighScores] = useState<ChimpTestResult[]>([]);
  const [hideNumbers, setHideNumbers] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const { user: { isAuthenticated } } = useUserContext();

  // Generate random positions for tiles
  const generateTiles = useCallback((count = level) => {
    const newTiles: Tile[] = [];
    const usedPositions = new Set<string>();

    for (let i = 1; i <= count; i++) {
      let top, left, positionKey;

      // Ensure no overlapping positions
      do {
        top = `${Math.random() * 80 + 10}%`; // 10%-90%
        left = `${Math.random() * 80 + 10}%`; // 10%-90%
        positionKey = `${top}-${left}`;
      } while (usedPositions.has(positionKey));

      usedPositions.add(positionKey);

      newTiles.push({
        number: i,
        top,
        left,
        visible: true
      });
    }

    return newTiles.sort((a, b) => a.number - b.number); // Sort by number
  }, [level]);

  const startGame = (newLevel?: number) => {
    setGameState('memorize');
    setCurrentNumber(1);
    setHideNumbers(false);
    setTiles(generateTiles(newLevel || level));
  };

  const handleTileClick = (tileNumber: number, index: number) => {
    if (gameState !== 'recall') return;
    if (!hideNumbers) {
      setHideNumbers(true);
    }
    // Hide all tiles after first click
    if (tiles.some(t => t.visible)) {
      setTiles(tiles.map(t => ({ ...t, visible: false })));
    }

    if (tileNumber === currentNumber) {
      const newTiles = tiles.filter((_, i) => i !== index);
      setTiles(newTiles)
      if (currentNumber === level) {
        // Completed level
        const nextLevel = level + 1;
        setLevel(prev => prev + 1);
        setTimeout(() => {
          setHideNumbers(false);
          startGame(nextLevel);
        }, 1000);
      } else {
        setCurrentNumber(prev => prev + 1);
      }
    } else {
      // Wrong tile clicked
      setGameState('finished');
    }
  };

  // const saveScore = async () => {
  //   try {
  //     await customFetch.post('/api/chimp-test/', {
  //       score: level - 3, // Score starts from 1 (level 4 = score 1)
  //     });
  //     fetchHighScores();
  //   } catch (error) {
  //     console.error('Error saving score:', error);
  //   }
  // };

  // const fetchHighScores = async () => {
  //   try {
  //     const response = await customFetch.get('/api/chimp-test/');
  //     setHighScores(response.data.results || []);
  //   } catch (error) {
  //     console.error('Error fetching scores:', error);
  //   }
  // };

  // Transition from memorize to recall phase
  useEffect(() => {
    if (gameState === 'memorize') {
      const timer = setTimeout(() => {
        setGameState('recall');
      }, 3000); // 3 seconds to memorize
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  function handleGameReset() {
    setLevel(4);
    setGameState('ready');
  }

  async function handleGameEnd() {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await customFetch.post('/api/submit/', {
        score: level - 3,
        created_at: new Date(),
        test_name: 'chimp-test'
      });
      console.log(response);
    } catch (err) {
      catchAxiosError(err);
    }
  }

  return (
    <div className="chimp-test-container">
      <div className="game-container">
        {showStats && (
          <>
            <GameStats gameName="chimp-test" />
            <button onClick={() => setShowStats(false)} className="start-button">
              Hide Stats
            </button>
          </>
        )}
      </div>
      <h2>Chimp Test</h2>
      <p>
        {gameState === 'ready' && 'Remember the numbers and click them in order'}
        {gameState === 'memorize' && `Memorize the numbers (Level ${level - 3})`}
        {gameState === 'recall' && 'Click the tiles in order from 1 upwards'}
        {gameState === 'finished' && `Game Over! Your score: ${level - 3}`}
      </p>

      {gameState === 'ready' && (
        <button onClick={() => startGame()} className="start-button">
          Start Test
        </button>
      )}

      {(gameState === 'memorize' || gameState === 'recall') && (
        <div className="game-area">
          {tiles.map((tile, index) => (
            <button
              key={tile.number}
              className={`tile ${gameState === 'memorize' ? 'visible' : 'hidden'}`}
              style={{ top: tile.top, left: tile.left }}
              onClick={() => handleTileClick(tile.number, index)}
            >
              {(gameState === 'memorize' || !hideNumbers) ? tile.number : ''}
            </button>
          ))}
        </div>
      )}

      {/* {gameState === 'finished' && (
        <div className="game-results">
          <button onClick={() => {
            setLevel(4);
            setGameState('ready');
          }} className="restart-button">
            Try Again
          </button>

          <div className="high-scores">
            <h3>High Scores</h3>
            <ol>
              {highScores.map((score, index) => (
                <li key={index}>
                  Score: {score.score} (Sequence: {score.sequence_length})
                </li>
              ))}
            </ol>
          </div>
        </div>
      )} */}
      {gameState === "finished" && (
        <ResultsScreen
          handleRestart={handleGameReset}
          description={`You scored ${level - 3}`}
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
};

export default ChimpTest;