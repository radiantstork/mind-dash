import React, {useState, useEffect, useRef} from "react";
import words from "./words.txt?raw";
import substrings from "./substrings.txt?raw";

const WORD_SET: Set<string> = new Set(
    words.split("\n").map(w => w.trim().toLowerCase())
);

const SUBSTRING_ARRAY: string[] = substrings
    .split("\n")
    .map(w => w.trim().toLowerCase());

const getRandomSubstring = () => 
    SUBSTRING_ARRAY[Math.floor(Math.random() * SUBSTRING_ARRAY.length)];

type GameStatus = "idle" | "running" | "over";

const WordGuessingTest: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [status, setStatus] = useState<GameStatus>("idle");
    const [substring, setSubstring] = useState("");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerId, setTimerId] = useState<number | null>(null);
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);

    // ----- Timer -----
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

        // const duration = Math.floor(Math.random() * 6) + 5;
        const duration = 5;
        setTimeLeft(duration);

        const id = window.setInterval(() => {
            // setTimeLeft(timeLeft - 1); // greseala 
            setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);

        setTimerId(id);
    }

    const clearTimer = () => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
    }

    const handleTimeout = () => {
        clearTimer();
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
            setStatus("over");
        } else {
            startNewRound();
        }
    }

    // ----- Game logic -----
    const startGame = () => {
        setGameStarted(true);
        setStatus("running");
        setScore(0);
        setLives(3);
        setUsedWords(new Set());
        startNewRound();
    }

    const startNewRound = () => {
        const randomSubstring = getRandomSubstring();
        setSubstring(randomSubstring);
        setInput("");
        startTimer();
        inputRef.current?.focus(); // ??
    }

    // ----- Input handling -----
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            checkAnswer();
        }
    }

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
    }

    const playWrongSound = () => {
        // audio
        console.log("WRONG");
    }

    return(
        <div>
            <h1>Word Guessing Game</h1>

            <p>Word Speed Test is a fast-paced language skills game designed to test your vocabulary, reflexes, and mental agility.</p> 
            <p>Each round presents you with a random letter sequence (substring), and your goal is to type an actual English word that contains that sequence — before time runs out.</p>
            <p>It’s ideal for sharpening linguistic instincts and reaction speed.</p>

            {!gameStarted && (
                <button onClick={startGame}>Start</button>
            )}

            {status === "running" && (
                <>
                    <p>Substring: {substring}</p>
                    <input 
                        ref={inputRef} 
                        type="text" 
                        value={input} 
                        onChange={handleInputChange} 
                        onKeyDown={handleInputKeyDown} 
                        autoFocus />
                    <p>Lives: {lives}</p>
                    <p>Score: {score}</p>
                </>
            )}

            {status === "over" && (
                <>
                    <p>Game Over!</p>
                    <p>Your final score: {score}</p>
                    <button onClick={startGame}>Play again</button>
                </>
            )}
        </div>
    );
}

export default WordGuessingTest;
