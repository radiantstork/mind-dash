import React, { useEffect, useState } from "react";

import styles from "./VerbalMemoryTest.module.css";

import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import TestArea from "../../components/TestArea/TestArea.tsx";
import Hearts from "../../components/Hearts/Hearts.tsx";
import OtherTests from "../../components/OtherTests/OtherTests.tsx";

import words from "../words.txt?raw";
import customFetch from "../../services/custom_fetch.ts";
import { VerbalMemoryGameState } from "../../types/games.ts";
import { useUserContext } from "../../context/UserContext.tsx";
import { catchAxiosError } from "../../services/catch_axios_error.ts";
import { RequestBody, VerbalMemoryPayload } from "../../components/Score.ts";

const MAX_SCORE = 5000;
const BATCH_SIZE = 50;
const REFRESH_THRESHOLD = 0.6;
const WORD_LIST: Array<string> = Array.from(
    words.split("\n").map(w => w.trim().toLowerCase()).filter(Boolean)
);

const VerbalMemoryTest: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
    const { user: { isAuthenticated } } = useUserContext();
    const [state, setState] = useState<VerbalMemoryGameState>({
        seenWords: [],
        currentWord: '',
        level: 0,
        lives: 2,
        gameStarted: false,
        gameOver: false,
        loading: false,
        highScores: []
    });
    const [wordPool, setWordPool] = useState<string[]>([]);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (status === "running") {
            loadNewWord();
        }
    }, [status]);

    const getRandomWords = (count: number, usedWords: Set<string>): string[] => {
        const selected: Set<string> = new Set();

        while (selected.size < count && selected.size + usedWords.size < WORD_LIST.length) {
            const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
            if (!usedWords.has(word) && !selected.has(word)) {
                selected.add(word);
            }
        }

        return Array.from(selected);
    };

    const loadNewWord = () => {
        if (wordPool.length === 0) return;

        const seenInPool = state.seenWords.filter(word => wordPool.includes(word)).length;
        const needRefresh = (seenInPool / wordPool.length) >= REFRESH_THRESHOLD;

        if (needRefresh) {
            const newBatch = getRandomWords(BATCH_SIZE, usedWords);
            setWordPool(prev => [...prev, ...newBatch]);
            setUsedWords(prev => {
                const updated = new Set(prev);
                newBatch.forEach(w => updated.add(w));
                return updated;
            });
        }

        const randomIndex = Math.floor(Math.random() * wordPool.length);
        setState(prev => ({
            ...prev,
            currentWord: wordPool[randomIndex]
        }));
    };

    const handleChoice = (hasSeen: boolean): void => {
        if (status !== "running") return;

        const alreadySeen = state.seenWords.includes(state.currentWord);
        const correct = hasSeen === alreadySeen;

        if (correct) {
            const newScore = state.level + 1;
            setState(prev => ({
                ...prev,
                level: newScore
            }));
            if (newScore >= MAX_SCORE) {
                setStatus("over");
                return;
            }

            if (!alreadySeen) {
                setState(prev => ({
                    ...prev,
                    seenWords: [...state.seenWords, state.currentWord]
                }))
            }

            loadNewWord();
        } else {
            const newLives = state.lives - 1;
            if (newLives <= 0) {
                endGame();
                setStatus("over");
            } else {
                setState(prev => ({
                    ...prev,
                    lives: newLives
                }))
                loadNewWord();
            }
        }
    };

    const startGame = () => {
        const initialWords = getRandomWords(BATCH_SIZE, new Set());
        setWordPool(initialWords);
        setUsedWords(new Set(initialWords));
        setState(prev => ({
            ...prev,
            seenWords: [],
            level: 0,
            lives: 3
        }))

        setStatus("running");
    };

    const endGame = async () => {
        try {
            // const response = await customFetch.post(
            //     '/api/verbal-memory/tests/',
            //     {
            //         score: state.score
            //     }
            // );

            setState(prev => ({
                ...prev,
                gameOver: true,
                gameStarted: false,
                // highScores: response.data?.results
                //     ? [...response.data.results.slice(0, 5)]
                //     : prev.highScores
            }));
        } catch (error) {
            catchAxiosError(error);
            setState(prev => ({
                ...prev,
                gameOver: true,
                gameStarted: false
            }));
        }
    };

    const restartGame = () => {
        setStatus("idle");
    };

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }

        const generator = new RequestBody(new VerbalMemoryPayload())
        try {
            const response = await customFetch.post('/api/submit/', generator.getBody({level: state.level}));
            console.log(response);
        } catch (err) {
            catchAxiosError(err);
        }
    }

    return (
        <>
            <TestArea onClick={startGame} clickable={status === "idle"}>
                {status === "idle" && (
                    <IntroScreen
                        title="Verbal Memory Test"
                        description="Can you remember which words you've seen?" />
                )}

                {status === "running" && (
                    <div className={styles.container}>
                        <p className={styles.score}>Score: {state.level}</p>

                        <h1 className={styles.word}>{state.currentWord}</h1>

                        <div className={styles.answersContainer}>
                            <button onClick={() => handleChoice(true)} className={styles.yes}>
                                YES
                            </button>
                            <button onClick={() => handleChoice(false)} className={styles.no}>
                                NO
                            </button>
                        </div>

                        <Hearts heartsLeft={state.lives} />
                    </div>
                )}

                {status === "over" && (
                    <ResultsScreen
                        description={`Your final score: ${state.level}`}
                        handleRestart={restartGame}
                        onGameEnd={handleGameEnd}
                    />
                )}
            </TestArea>

            <OtherTests currentId="verbal-memory" />
            {/* <div className="game-container">
                {showStats && (
                    <>
                        <GameStats gameName="verbal-memory" />
                        <button onClick={() => setShowStats(false)} className="start-button">
                            Hide Stats
                        </button>
                    </>
                )}
            </div> */}
        </>
    );
};

export default VerbalMemoryTest;
