import { useState, useEffect } from 'react';
import styles from './VisualMemory.module.css';
import TestArea from '../../components/TestArea/TestArea';
import IntroScreen from '../../components/IntroScreen/IntroScreen';
import OtherTests from '../../components/OtherTests/OtherTests';
import ResultsScreen from '../../components/ResultsScreen/ResultsScreen';
import customFetch from '../../services/custom_fetch';
import { useUserContext } from '../../context/UserContext';
import { catchAxiosError } from '../../services/catch_axios_error';
import { RequestBody, VisualMemoryPayload } from '../../components/Score';

type TileState = {
  isPattern: boolean;
  isClicked: boolean;
};

type GameStage = "start" | "pattern_display" | "playable" | "finish" | "game_over";

type GameState = {
  mode: 'training' | 'official';

  level: number;
  gridSize: number;
  tiles: TileState[];
  pattern: number[];
  misclicks: number;
  lives: number;
  bossMusicLevel: number;

  stage: GameStage;
}

const initialGameState: GameState = {
  mode: "official",
  level: 1,
  tiles: [],
  pattern: [],
  misclicks: 3,
  lives: 3,
  gridSize: 3,
  bossMusicLevel: 7,
  stage: "start"
}


const VisualMemory = () => {
  const { user } = useUserContext();
  console.log(user.isAuthenticated);
  const [gameState, setGameState] = useState(initialGameState);
  const [currentLevel, setCurrentLevel] = useState<string>("1");
  const { user: { isAuthenticated } } = useUserContext();

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
      stage: "pattern_display",
      level: actualLevel,
      gridSize: getGridSize(actualLevel)
    });
  }

  // -----------------Game start zone----------------

  function handleGameStart() {
    setGameState(prev => {
      return {
        ...prev,
        stage: "pattern_display"
      }
    });
  }

  function handleGameReset() {
    setGameState(initialGameState);
  }

  // ------------Pattern display zone--------------
  useEffect(() => {
    if (gameState.stage != "pattern_display") {
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
          stage: "playable"
        }
      })
    }, 2000);


    return () => {
      clearTimeout(memorizeTimeout);
      clearTimeout(preparationTimeout);
    }
  }, [gameState.stage]);

  // -------------Playable zone------------------
  const handleTileClick = (index: number) => {
    if (gameState.stage !== "playable") return;

    if (gameState.tiles[index].isClicked) return;

    const newTiles = [...gameState.tiles];

    if (!gameState.tiles[index].isPattern) {
      handlePropChange("misclicks", gameState.misclicks - 1);
    }

    newTiles[index].isClicked = true;
    handlePropChange("tiles", newTiles);
  };


  useEffect(() => {
    if (gameState.misclicks === 0) {
      setGameState(prev => {
        return {
          ...prev,
          stage: "finish"
        }
      });
    }
  }, [gameState.misclicks]);


  useEffect(() => {
    if (gameState.stage !== "playable") {
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
          stage: "finish"
        }
      })
    }
  }, [gameState.tiles]);


  //----------Finish zone--------------
  useEffect(() => {
    if (gameState.stage !== "finish") {
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
                stage: "game_over"
              }
            })
          } else {
            setGameState(prev => {
              return {
                ...prev,
                stage: "pattern_display",
                lives: gameState.lives - 1,
                misclicks: initialGameState.misclicks,
              }
            })
          }
        } else {
          setGameState(prev => {
            return {
              ...prev,
              stage: "pattern_display",
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
            stage: "pattern_display"
          }
        });
      }
    }, 600);

  }, [gameState.stage]);

  // ------------Game over zone----------------

  const getTileClass = (tile: TileState) => {
    if (gameState.stage === "pattern_display") {
      return tile.isPattern ? styles.tileHighlighted : styles.tile;
    }
    if (tile.isClicked) {
      return tile.isPattern ? styles.tileHighlighted : styles.tileWrong;
    }
    return styles.tile;
  };

  async function handleGameEnd() {
    if (!isAuthenticated) {
      return;
    }

    const generator = new RequestBody(new VisualMemoryPayload());
    try {
      const response = await customFetch.post('/api/submit/', generator.getBody({level: gameState.level}));
      console.log(response);
    } catch (err) {
      catchAxiosError(err);
    }
  }

  return (<>
    <TestArea onClick={handleGameStart} clickable={gameState.stage === "start"}>
      {gameState.stage === "start" && (
        <IntroScreen
          title="Visual Memory Test"
          description={`Can you remember more than 10 tiles at once? - ${gameState.mode} mode`}
        />
      )}
      {gameState.stage !== "start" && gameState.stage !== "game_over" && <div className={styles.gameContainer}>
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
              disabled={gameState.stage === "pattern_display"}
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
      {gameState.stage === "game_over" && (
        <ResultsScreen
          description={`You can memorize up to ${gameState.level - 1} tiles at once. 
            ${gameState.level >= gameState.bossMusicLevel ? "Not bad" : ""}`}
          handleRestart={handleGameReset}
          onGameEnd={handleGameEnd} />
      )}
    </TestArea>
    <OtherTests currentId="visual-memory" />
  </>);
};

export default VisualMemory;