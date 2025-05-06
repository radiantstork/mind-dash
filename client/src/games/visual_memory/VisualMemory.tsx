import { useState, useEffect } from 'react';
import styles from './VisualMemory.module.css';
import GameIntro from './GameIntro';

type TileState = {
  isPattern: boolean;
  isClicked: boolean;
};

type GameState = {
  mode: 'training' | 'official';

  level: number;
  gridSize: number;
  tiles: TileState[];
  pattern: number[];
  misclicks: number;
  lives: number;

  start: boolean;
  patternDisplay: boolean;
  playable: boolean;
  finished: boolean;
  gameOver: boolean;
}

const initialGameState: GameState = {
  mode: "official",
  level: 1,
  tiles: [],
  pattern: [],
  misclicks: 3,
  lives: 3,
  gridSize: 3,

  start: true,
  patternDisplay: false,
  playable: false,
  finished: false,
  gameOver: false,
}

/*

*/


const VisualMemory = () => {
  const [gameState, setGameState] = useState(initialGameState);
  const [currentLevel, setCurrentLevel] = useState<string>("1");

  const generatePattern = () => {
    const totalTiles = gameState.gridSize * gameState.gridSize;
    const patternLength = Math.min(gameState.level + 2, totalTiles);
    const indices = new Set<number>();

    while (indices.size < patternLength) {
      indices.add(Math.floor(Math.random() * totalTiles));
    }

    return Array.from(indices);
  }

  function getGridSize(level: number) {
    return Math.ceil(Math.log2(level * level + 7));
  }

  function handlePropChange(prop: string, value: unknown) {
    setGameState(currentState => {
      return {
        ...currentState,
        [prop]: value
      }
    });
  }

  function generateTiles(pattern: number[]) {
    const tiles = Array(gameState.gridSize * gameState.gridSize)
      .fill(null)
      .map((_, index) => ({
        isPattern: pattern.includes(index),
        isClicked: false,
      }));
    handlePropChange("tiles", tiles);
    return tiles;
  }

  function handleLevelSet() {
    let actualLevel;
    try {
      actualLevel = Number.parseInt(currentLevel);
      if (actualLevel < 1 || actualLevel > 30) {
        actualLevel = 1;
      }
    } catch (err) {
      actualLevel = 1;
    }

    setGameState({
      ...initialGameState,
      mode: "training",
      start: false,
      patternDisplay: true,
      level: actualLevel,
      gridSize: getGridSize(actualLevel)
    });
  }

  // -----------------Game start zone----------------

  function handleGameStart() {
    console.log("Start state");

    setGameState(prev => {
      return {
        ...prev,
        start: false,
        patternDisplay: true,
      }
    });
  }

  // ------------Pattern display zone--------------
  useEffect(() => {
    console.log("Pattern display: " + gameState.patternDisplay);

    if (!gameState.patternDisplay) {
      return;
    }

    generateTiles([]);
    const newPattern = generatePattern();
    handlePropChange("pattern", newPattern);

    const preparationTimeout = setTimeout(() => {
      generateTiles(newPattern);
    }, 1000);

    const memorizeTimeout = setTimeout(() => {
      setGameState(prev => {
        return {
          ...prev,
          patternDisplay: false,
          playable: true
        }
      })
    }, 2000);


    return () => {
      clearTimeout(memorizeTimeout);
      clearTimeout(preparationTimeout);
    }
  }, [gameState.patternDisplay]);

  // -------------Playable zone------------------
  const handleTileClick = (index: number) => {
    if (!gameState.playable) return;

    const newTiles = [...gameState.tiles];

    if (!gameState.tiles[index].isPattern) {
      handlePropChange("misclicks", gameState.misclicks - 1);
    }

    newTiles[index].isClicked = true;
    handlePropChange("tiles", newTiles);
  };


  useEffect(() => {
    console.log("Misclick: " + gameState.misclicks);
    if (gameState.misclicks === 0) {
      setGameState(prev => {
        return {
          ...prev,
          playable: false,
          finished: true
        }
      });
    }
  }, [gameState.misclicks]);


  useEffect(() => {
    console.log("Tile click: " + gameState.playable);
    if (!gameState.playable) {
      return;
    }

    const remainingTiles = gameState.tiles.find(tile => {
      if (!tile.isClicked && tile.isPattern) {
        return true;
      }
      return false;
    })

    if (remainingTiles === undefined) {
      setGameState(prev => {
        return {
          ...prev,
          playable: false,
          finished: true
        }
      })
    }
  }, [gameState.tiles]);


  //----------Finish zone--------------
  useEffect(() => {
    if (!gameState.finished) {
      return;
    }

    setTimeout(() => {
      generateTiles([]);
      handlePropChange("pattern", []);
    }, 500);

    setTimeout(() => {
      if (gameState.mode === "official") {
        if (gameState.misclicks === 0) {
          if (gameState.lives <= 1) {
            setGameState(prev => {
              return {
                ...prev,
                finished: false,
                gameOver: true,
              }
            })
          } else {
            setGameState(prev => {
              return {
                ...prev,
                finished: false,
                patternDisplay: true,
                lives: gameState.lives - 1,
                misclicks: initialGameState.misclicks,
              }
            })
          }
        } else {
          setGameState(prev => {
            return {
              ...prev,
              patternDisplay: true,
              finished: false,
              level: gameState.level + 1,
              gridSize: getGridSize(gameState.level + 1),
              misclicks: initialGameState.misclicks,
            }
          });
        }
      } else {
        setGameState((prev) => {
          return {
            ...prev,
            misclicks: initialGameState.misclicks,
            patternDisplay: true,
            finished: false,
          }
        });
      }
    }, 600);

  }, [gameState.finished]);

  // ------------Game over zone----------------

  const getTileClass = (tile: TileState) => {
    if (gameState.patternDisplay) {
      return tile.isPattern ? styles.tileHighlighted : styles.tile;
    }
    if (tile.isClicked) {
      return tile.isPattern ? styles.tileHighlighted : styles.tileWrong;
    }
    return styles.tile;
  };

  return (
    <>
      {gameState.start && <GameIntro onGameStart={handleGameStart} />}
      {!gameState.start && !gameState.gameOver && <div className={styles.gameContainer}>
        <div className={styles.gameInfo}>
          <div>Level: {gameState.level}</div>
          {gameState.mode === "official" && <div>Lives left: {gameState.lives}</div>}
          <div>Mode: {gameState.mode}</div>
        </div>
        {gameState.mode === "training" && (
          <div>
            <label htmlFor='game_level'>On training mode you have to choose the level (between 1 and 30):</label>
            <input type='number' value={currentLevel} id="game_level" className={styles.blockInput}
              onChange={(e) => setCurrentLevel(e.target.value)} />
            <button
              className={styles.startButton}
              onClick={handleLevelSet}
            >
              Set level
            </button>
          </div>
        )}
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${gameState.gridSize}, 1fr)`,
            maxWidth: `${Math.min(600, gameState.gridSize * 100)}px`
          }}
        >
          {gameState.tiles.map((tile, index) => (
            <button
              key={index}
              className={getTileClass(tile)}
              onClick={() => handleTileClick(index)}
              disabled={gameState.patternDisplay}
            />
          ))}
        </div>

        <div className={styles.modeSelector}>
          <button
            className={gameState.mode === 'official' ? styles.activeButton : ''}
            onClick={() => setGameState({ ...initialGameState })}
          >
            Official Mode
          </button>
          <button
            className={gameState.mode === 'training' ? styles.activeButton : ''}
            onClick={() => setGameState({ ...initialGameState, mode: "training" })}
          >
            Training Mode
          </button>
        </div>
      </div>}
    </>
  );
};

export default VisualMemory;