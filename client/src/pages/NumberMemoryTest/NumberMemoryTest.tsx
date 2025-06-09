import React, { useState } from "react";

import styles from "./NumberMemoryTest.module.css";
import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import Hearts from "../../components/Hearts/Hearts.tsx";
import SubmitButton from "../../components/SubmitButton/SubmitButton.tsx";
import OtherTests from "../../components/OtherTests/OtherTests.tsx";
import customFetch from "../../services/custom_fetch.ts";
import { useUserContext } from "../../context/UserContext.tsx";
import { catchAxiosError } from "../../services/catch_axios_error.ts";

const NumberMemoryTest: React.FC = () => {
    const [score, setScore] = useState(3);
    const [lives, setLives] = useState(3);
    const [number, setNumber] = useState("");
    const [userInput, setUserInput] = useState("");
    const [status, setStatus] = useState<"idle" | "input" | "over">("idle");
    const [showNumber, setShowNumber] = useState(false);
    const { user: { isAuthenticated } } = useUserContext();

    const generateRandNum = (length: number): string => {
        let result = "";
        for (let i = 0; i < length; ++i) {
            result += String.fromCharCode(48 + Math.floor(Math.random() * 10));
        }
        return result;
    };

    const startGame = () => {
        setScore(1);
        setLives(3);
        setStatus("input");
        const newNum = generateRandNum(1);
        setNumber(newNum);
        setUserInput("");
        setShowNumber(true);

        setTimeout(() => {
            setShowNumber(false);
        }, 1000);
    }

    const nextLevel = (newLevel: number) => {
        const newNum = generateRandNum(newLevel);
        setNumber(newNum);
        setUserInput("");
        setShowNumber(true);

        setTimeout(() => {
            setShowNumber(false);
        }, newLevel * 1000);
    }

    const handleSubmit = async () => {
        if (userInput === number) {
            const next = score + 1;
            setScore(next);
            nextLevel(next);
        } else {
            if (lives > 1) {
                setLives(prev => prev - 1);
                nextLevel(score);
            } else {
                setStatus("over");
                // await customFetch.post(
                //     '/api/number-memory/tests/',
                //     {
                //         score: score
                //     }
                // );
            }
        }
    }

    const restartTest = () => {
        setStatus("idle");
        setScore(1);
        setLives(3);
        setNumber("");
        setUserInput("");
        setShowNumber(false);
    }

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }

        try {
            const response = await customFetch.post('/api/submit/', {
                score: score - 1,
                created_at: new Date(),
                test_name: 'number-memory'
            });
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
                        title="Number Memory Test"
                        description="What is the longest number that you can remember?" />
                )}

                {status === "input" && (
                    <div className={styles.sndScreen}>
                        {showNumber ? (
                            <h1 className={styles.number}>
                                {number}
                            </h1>
                        ) : (
                            <>
                                <h1 className={styles.question}>
                                    What was the number?
                                </h1>

                                <input
                                    className={styles.input}
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    placeholder="Enter the number" />

                                <SubmitButton onClick={handleSubmit} />
                            </>
                        )}

                        <Hearts heartsLeft={lives} />
                    </div>
                )}

                {status === "over" && (
                    <ResultsScreen
                        description={`You remembered at most: ${score - 1} ${score - 1 == 1 ? "digit" : "digits"}`}
                        handleRestart={restartTest}
                        onGameEnd={handleGameEnd}
                    />
                )}
            </TestArea>

            <OtherTests currentId="number-memory" />
            {/* <div className="game-container">
                {showStats && (
                    <>
                        <GameStats gameName="number-memory" />
                        <button onClick={() => setShowStats(false)} className="start-button">
                            Hide Stats
                        </button>
                        </div>
                    </>
                )}
            </div> */}
        </>
    );
};

export default NumberMemoryTest;
