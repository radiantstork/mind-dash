import { useEffect, useState } from "react";

import styles from "./VerbalMemoryTest.module.css";

import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import TestArea from "../../components/TestArea/TestArea.tsx";
import Hearts from "../../components/Hearts/Hearts.tsx";
import OtherTests from "../../components/OtherTests/OtherTests.tsx";

import words from "../words.txt?raw";

const MAX_SCORE = 5000;
const BATCH_SIZE = 50;
const REFRESH_THRESHOLD = 0.6;
const WORD_LIST: Array<string> = Array.from(
    words.split("\n").map(w => w.trim().toLowerCase()).filter(Boolean)
);

const VerbalMemoryTest: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
    const [seenWords, setSeenWords] = useState<string[]>([]);
    const [currentWord, setCurrentWord] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [lives, setLives] = useState<number>(3);

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

        const seenInPool = seenWords.filter(word => wordPool.includes(word)).length;
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
        setCurrentWord(wordPool[randomIndex]);
    };

    const handleChoice = (hasSeen: boolean): void => {
        if (status !== "running") return;

        const alreadySeen = seenWords.includes(currentWord);
        const correct = hasSeen === alreadySeen;

        if (correct) {
            const newScore = score + 1;
            setScore(newScore);

            if (newScore >= MAX_SCORE) {
                setStatus("over");
                return;
            }

            if (!alreadySeen) {
                setSeenWords(prev => [...prev, currentWord]);
            }

            loadNewWord();
        } else {
            const newLives = lives - 1;
            if (newLives <= 0) {
                setStatus("over");
            } else {
                setLives(newLives);
                loadNewWord();
            }
        }
    };

    const startGame = () => {
        const initialWords = getRandomWords(BATCH_SIZE, new Set());
        setWordPool(initialWords);
        setUsedWords(new Set(initialWords));
        setSeenWords([]);
        setScore(0);
        setLives(3);
        setStatus("running");
    };

    const restartGame = () => {
        setStatus("idle");
    };

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
                    <p className={styles.score}>Score: {score}</p>

                    <h1 className={styles.word}>{currentWord}</h1>

                    <div className={styles.answersContainer}>
                        <button onClick={() => handleChoice(true)} className={styles.yes}>
                            YES
                        </button>
                        <button onClick={() => handleChoice(false)} className={styles.no}>
                            NO
                        </button>
                    </div>

                    <Hearts heartsLeft={lives} />
                </div>
            )}

            {status === "over" && (
                <ResultsScreen
                    description={`Your final score: ${score}`}
                    handleRestart={restartGame}
                />
            )}
        </TestArea>

        <OtherTests currentId="verbal-memory" />
        </>
    );
};

export default VerbalMemoryTest;
