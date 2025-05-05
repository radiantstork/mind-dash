import { useState, useEffect, useRef } from "react";
import styles from "./ColorMemoryTest.module.css";

import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import Hearts from "../../components/Hearts/Hearts.tsx";

enum GameStatus {
    Idle = "idle",
    Showing = "showing",
    Input = "input",
    Over = "over",
}

type Color =
    | "red" | "blue" | "green" | "yellow" | "orange" | "purple"
    | "pink" | "black" | "gray" | "indigo" | "lime" | "brown"
    | "peach" | "mustard" | "beige";

const ALL_COLORS: Color[] = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "black",
    "gray", "indigo", "lime", "brown", "peach", "mustard", "beige"
];

const COLORS: Record<Color, string> = {
    red: "#f50a0a",
    blue: "#1d6ef0",
    green: "#0be316",
    yellow: "#ecf714",
    orange: "#fc8700",
    purple: "#900cad",
    pink: "#ed07c3",
    black: "#171617",
    gray: "#706d70",
    indigo: "#6a5acd",
    lime: "#aaff00",
    brown: "#703418",
    peach: "#ffe5b4",
    mustard: "#ffdb58",
    beige: "#f5f5dc",
};

const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const ColorMemoryTest: React.FC = () => {
    const [status, setStatus] = useState<GameStatus>(GameStatus.Idle);
    const [score, setScore] = useState(1);
    const [sequence, setSequence] = useState<Color[]>([]);
    const [userInput, setUserInput] = useState<Color[]>([]);
    const [hearts, setHearts] = useState(3);
    const [currentColorIndex, setCurrentColorIndex] = useState<number | null>(null);
    const [clickedColors, setClickedColors] = useState<Set<Color>>(new Set());
    const [clickLocked, setClickLocked] = useState(false);

    const timers = useRef<number[]>([]);

    const availableColors = ALL_COLORS.slice(0, Math.min(score, ALL_COLORS.length));

    useEffect(() => {
        if (status !== GameStatus.Showing) return;

        const newSequence = shuffle(availableColors).slice(0, availableColors.length);
        setSequence(newSequence);
        setClickedColors(new Set());

        let i = 0;
        const showNext = () => {
            if (i >= newSequence.length) {
                setCurrentColorIndex(null);
                timers.current.push(window.setTimeout(() => setStatus(GameStatus.Input), 400));
                return;
            }

            setCurrentColorIndex(i);
            timers.current.push(window.setTimeout(() => {
                setCurrentColorIndex(null);
                timers.current.push(window.setTimeout(() => {
                    i++;
                    showNext();
                }, 400));
            }, 1000));
        };

        showNext();

        return () => {
            timers.current.forEach(clearTimeout);
            timers.current = [];
        };
    }, [status, score]);

    const startTest = () => {
        setScore(1);
        setHearts(3);
        setUserInput([]);
        setClickedColors(new Set());
        setStatus(GameStatus.Showing);
    };

    const restartTest = () => {
        setStatus(GameStatus.Idle);
    };

    const handleColorClick = (color: Color) => {
        if (status !== GameStatus.Input || clickedColors.has(color) || clickLocked) return;

        setClickedColors(prev => new Set(prev).add(color));
        const updatedInput = [...userInput, color];
        setUserInput(updatedInput);

        const correct = sequence[updatedInput.length - 1] === color;
        if (!correct) {
            const remaining = hearts - 1;
            setHearts(remaining);
            setClickLocked(true);

            timers.current.push(window.setTimeout(() => {
                if (remaining <= 0) {
                    setStatus(GameStatus.Over);
                } else {
                    setUserInput([]);
                    setClickedColors(new Set());
                    setClickLocked(false);
                    setStatus(GameStatus.Showing);
                }
            }, 1000));
        } else if (updatedInput.length === sequence.length) {
            timers.current.push(window.setTimeout(() => {
                setScore(prev => Math.min(prev + 1, ALL_COLORS.length));
                setUserInput([]);
                setClickedColors(new Set());
                setStatus(GameStatus.Showing);
            }, 500));
        }
    };

    return (
        <TestArea onClick={startTest} clickable={status === GameStatus.Idle}>
            {status === GameStatus.Idle && (
                <IntroScreen 
                    title="Color Memory Test"
                    description="What's the longest color sequence you can memorize?" />
            )}

            {status === GameStatus.Showing && (
                <div className={styles.sndScreen}>
                    <div
                        className={styles.circle}
                        style={{
                            backgroundColor:
                                currentColorIndex !== null ? COLORS[sequence[currentColorIndex]] : "#f0f0f0",
                            transition: "background-color 0.4s ease-in-out",
                        }}
                    />
                </div>
            )}

            {status === GameStatus.Input && (
                <div className={styles.sndScreen}>
                    <div className={styles.circle} style={{ backgroundColor: "#f0f0f0" }} />
                    <div className={styles.colorButtons}>
                        {availableColors.map(color => {
                            const isClicked = clickedColors.has(color);
                            return (
                                <button
                                    key={color}
                                    id={`color-${color}`}
                                    className={`${styles.colorButton} ${isClicked ? styles.clicked : ""}`}
                                    style={{
                                        backgroundColor: isClicked ? "#ffffff" : COLORS[color],
                                        transition: "background-color 0.4s ease-in-out",
                                    }}
                                    onClick={() => handleColorClick(color)}
                                    disabled={isClicked}
                                />
                            );
                        })}
                    </div>
                    <Hearts heartsLeft={hearts} />
                </div>
            )}

            {status === GameStatus.Over && (
                <ResultsScreen
                    description={`You remembered at most: ${score - 1} ${score - 1 == 1 ? "color" : "colors"}`}
                    handleRestart={restartTest}
                />
            )}
        </TestArea>
    );
};

export default ColorMemoryTest;
