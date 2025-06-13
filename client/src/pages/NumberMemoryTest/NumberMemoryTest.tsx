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
import { NumberMemoryPayload, RequestBody } from "../../components/Score.ts";
import { toast } from "react-toastify";

const NumberMemoryTest: React.FC = () => {
    const [level, setLevel] = useState(3);
    const [lives, setLives] = useState(3);
    const [number, setNumber] = useState("");
    const [userInput, setUserInput] = useState("");
    const [status, setStatus] = useState<"idle" | "input" | "over">("idle");
    const [showNumber, setShowNumber] = useState(false);
    const { user: { isAuthenticated } } = useUserContext();
    const [showInterval, setShowInterval] = useState<NodeJS.Timeout | null>();

    const generateRandNum = (length: number): string => {
        let result = "";
        for (let i = 0; i < length; ++i) {
            result += String.fromCharCode(48 + Math.floor(Math.random() * 10));
        }
        return result;
    };

    const handleAreaClick = () => {
        if (status === 'idle') {
            setLevel(1);
            setLives(3);
            setStatus("input");
            const newNum = generateRandNum(1);
            setNumber(newNum);
            setUserInput("");
            setShowNumber(true);

            setTimeout(() => {
                setShowNumber(false);
            }, 1000);
            return;
        }

        if (status === 'input' && showInterval) {
            clearInterval(showInterval);
            setShowInterval(null);
            setShowNumber(false);
        }
    }

    const nextLevel = (newLevel: number) => {
        const newNum = generateRandNum(newLevel);
        setNumber(newNum);
        setUserInput("");
        setShowNumber(true);

        setShowInterval(
            setTimeout(() => {
                setShowNumber(false);
                setShowInterval(null);
            }, newLevel * 1000)
        );
    }

    const handleSubmit = async () => {
        console.log(userInput);
        if (userInput.length === 0) {
            toast.error('Input length must not be empty');
            return;
        }
        if (userInput === number) {
            const next = level + 1;
            setLevel(next);
            nextLevel(next);
        } else {
            if (lives > 1) {
                setLives(prev => prev - 1);
                nextLevel(level);
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
        setLevel(1);
        setLives(3);
        setNumber("");
        setUserInput("");
        setShowNumber(false);
    }

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }

        const generator = new RequestBody(new NumberMemoryPayload())
        try {
            const response = await customFetch.post('/api/submit/', generator.getBody({ level }));
            console.log(response);
        } catch (err) {
            catchAxiosError(err);
        }
    }

    return (
        <>
            <TestArea onClick={handleAreaClick} clickable={status === "idle" || status === 'input'}>
                {status === "idle" && (
                    <IntroScreen
                        title="Number Memory Test"
                        description="What is the longest number that you can remember?" />
                )}

                {status === "input" && (
                    <div className={styles.sndScreen}>
                        {showNumber ? (
                            <h1 className={styles.number}
                                onKeyDown={(e) => {
                                    console.log(e.key);
                                    if (e.key === 'Enter') {
                                        console.log("clicked");
                                        handleAreaClick();
                                    }
                                }}
                            >
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
                                    autoFocus={status === 'input'}
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
                        description={`You remembered at most: ${level - 1} ${level - 1 == 1 ? "digit" : "digits"}`}
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
