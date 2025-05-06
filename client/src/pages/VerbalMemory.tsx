import React, { useState, useEffect } from 'react';
import '../VerbalMemory.css';
import {VerbalMemoryGameState, VerbalMemoryTest, Word} from "../types/games.ts"; // Create this for custom styles
import GameStats from './GameStats';
import customFetch from "../services/custom_fetch.ts";

const VerbalMemory: React.FC = () => {
    const [showStats, setShowStats] = useState(true);
  const [state, setState] = useState<VerbalMemoryGameState>({
    seenWords: [],
    currentWord: '',
    score: 0,
    lives: 2,
    gameStarted: false,
    gameOver: false,
    loading: false,
    highScores: []
  });

  useEffect(() => {
    if (state.gameStarted && !state.gameOver) {
      fetchNewWord();
    }
  }, [state.gameStarted, state.gameOver]);

  const fetchNewWord = async () => {
    try {
      setState((prev: any) => ({ ...prev, loading: true }));
      const response = await customFetch.get('/api/verbal-memory/random-word/');
      console.log(response)
      const word: Word = response.data['word'];
      setState((prev: any) => ({ ...prev, currentWord: word, loading: false }));
    } catch (error) {
      console.error('Error fetching word:', error);
      setState((prev: any) => ({ ...prev, loading: false }));
    }
  };

  const startGame = () => {
    setState({
      seenWords: [],
      currentWord: '',
      score: 0,
      lives: 2,
      gameStarted: true,
      gameOver: false,
      loading: false,
      highScores: state.highScores
    });
  };

  const handleChoice = (hasSeen: boolean) => {
  if (state.loading) return;

  const isCorrect = hasSeen
    ? state.seenWords.includes(state.currentWord)
    : !state.seenWords.includes(state.currentWord);

  if (isCorrect) {
    setState(prev => ({
      ...prev,
      score: prev.score + 1,
      seenWords: prev.seenWords.includes(prev.currentWord)
        ? prev.seenWords
        : [...prev.seenWords, prev.currentWord]
    }));
    fetchNewWord();
  } else {
    const newLives = state.lives - 1;
    if (newLives <= 0) {
      endGame();
    } else {
      setState(prev => ({
        ...prev,
        lives: newLives
      }));
      fetchNewWord();
    }
  }
};

  const endGame = async () => {
    try {
      const response = await customFetch.post(
          '/api/verbal-memory/tests/',
          {
        score: state.score}
      );

      setState(prev => ({
        ...prev,
        gameOver: true,
        gameStarted: false,
        highScores: response.data?.results
          ? [...response.data.results.slice(0, 5)]
          : prev.highScores
      }));
    } catch (error) {
      console.error('Error saving score:', error);
      setState(prev => ({
        ...prev,
        gameOver: true,
        gameStarted: false
      }));
    }
  };

  return (
    <div className="verbal-memory-container">
      <div className="game-container">
      {showStats && (
        <>
          <GameStats gameName="verbal-memory" />
          <button onClick={() => setShowStats(false)} className="start-button">
            Hide Stats
          </button>
        </>
      )}
      </div>

      <h2 className="game-title">Verbal Memory Test</h2>

      {!state.gameStarted && !state.gameOver && (
        <div className="game-start-screen">
          <p className="instructions">
            You will be shown words one at a time. If you've seen the word before,
            click "SEEN". If it's new, click "NEW".
          </p>
          <button
            onClick={startGame}
            className="start-button"
          >
            Start Game
          </button>
        </div>
      )}

      {state.gameStarted && !state.gameOver && (
        <div className="game-active-screen">
          <div className="score-display">
            <p>Score: <span className="score-value">{state.score}</span></p>
            <p>Lives: <span className="level-value">{state.lives}</span></p>
          </div>

          <div className="word-display-area">
            {state.loading ? (
              <p className="loading-text">Loading word...</p>
            ) : (
              <p className="current-word">{state.currentWord}</p>
            )}
          </div>

          <div className="button-group">
            <button
              onClick={() => handleChoice(false)}
              className="choice-button new-button"
            >
              NEW
            </button>
            <button
              onClick={() => handleChoice(true)}
              className="choice-button seen-button"
            >
              SEEN
            </button>
          </div>
        </div>
      )}

      {state.gameOver && (
        <div className="game-over-screen">
          <h3 className="game-over-title">Game Over!</h3>
          <div className="results-summary">
            <p>Your score: <span className="final-score">{state.score}</span></p>
          </div>

          <button
            onClick={startGame}
            className="play-again-button"
          >
            Play Again
          </button>

          {state.highScores.length > 0 && (
            <div className="high-scores">
              <h4 className="high-scores-title">High Scores</h4>
              <ul className="scores-list">
                {state.highScores.map((test: VerbalMemoryTest, index: number) => (
                  <li key={index} className="score-item">
                    <span className="score-rank">{index + 1}.</span>
                    <span className="score-value">{test.score}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerbalMemory;