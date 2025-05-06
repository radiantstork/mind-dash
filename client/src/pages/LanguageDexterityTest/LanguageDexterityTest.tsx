import { useState, useEffect, useRef } from "react";

import words from "../words.txt?raw";
import substrings from "../substrings.txt?raw";

import styles from "./LanguageDexterityTest.module.css";
import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import Hearts from "../../components/Hearts/Hearts.tsx";
import OtherTests from "../../components/OtherTests/OtherTests.tsx";

const WORD_SET: Set<string> = new Set(
    words.split("\n").map(w => w.trim().toLowerCase())
);

const SUBSTRING_ARRAY: string[] = substrings
    .split("\n")
    .map(w => w.trim().toLowerCase());

const getRandomSubstring = () =>
    SUBSTRING_ARRAY[Math.floor(Math.random() * SUBSTRING_ARRAY.length)];

type GameStatus = "idle" | "running" | "over";

const LanguageDexterityTest: React.FC = () => {
    const [status, setStatus] = useState<GameStatus>("idle");
    const [substring, setSubstring] = useState("");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerId, setTimerId] = useState<number | null>(null);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === "running") {
            setScore(0);
            setLives(3);
            setUsedWords(new Set());
            startNewRound();
        }
    }, [status]);

    useEffect(() => {
        if (status !== "running") {
            return;
        }

        if (timeLeft <= 0) {
            handleTimeout();
        }
    }, [timeLeft]);

    const startTimer = () => {
        if (timerId) {
            clearInterval(timerId);
        }

        setTimeLeft(5);

        const id = window.setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        setTimerId(id);
    };

    const clearTimer = () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
    };

    const handleTimeout = () => {
        clearTimer();
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
            setStatus("over");
        } else {
            startNewRound();
        }
    };

    const startNewRound = () => {
        setSubstring(getRandomSubstring());
        setInput("");
        startTimer();
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            checkAnswer();
        }
    };

    const checkAnswer = () => {
        const playerWord = input.toLowerCase();

        if (!WORD_SET.has(playerWord) || !playerWord.includes(substring) || usedWords.has(playerWord)) {
            playWrongSound();
            return;
        }

        setScore(score + 1);
        setUsedWords(new Set(usedWords).add(playerWord));
        clearTimer();
        startNewRound();
    };

    const playWrongSound = () => {
        console.log("WRONG");
    };

    const restartTest = () => {
        setStatus("idle");
    }

    return (
        <>
        <TestArea onClick={() => setStatus("running")} clickable={status === "idle"}>
            {status === "idle" && (
                <IntroScreen 
                    title="Language Dexterity Test" 
                    description="Can you continuously find English words containing the given letters?" />
            )}

            {status === "running" && (
                <div className={styles.sndScreen}>
                    <h2 className={styles.question}>
                        {substring}
                    </h2>

                    <input
                        ref={inputRef}
                        className={styles.input}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Enter a word"/>

                    <Hearts heartsLeft={lives} />

                    <p className={styles.currentScore}>
                        Score: {score}
                    </p>
                </div>
            )}

            {status === "over" && (
                <ResultsScreen 
                    description={`You lasted: ${score} ${score == 1 ? "word" : "words"}`} 
                    handleRestart={restartTest}/>
            )}
        </TestArea>

        <OtherTests currentId="language-dexterity" />
        </>
    );
};

export default LanguageDexterityTest;
