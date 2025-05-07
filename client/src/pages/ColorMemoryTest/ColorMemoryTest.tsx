import { useState, useEffect, useRef } from "react";
import styles from "./ColorMemoryTest.module.css";

import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import Hearts from "../../components/Hearts/Hearts.tsx";
import OtherTests from "../../components/OtherTests/OtherTests.tsx";
import { useUserContext } from "../../context/UserContext.tsx";
import { catchAxiosError } from "../../services/catch_axios_error.ts";
import customFetch from "../../services/custom_fetch.ts";

type Color = "red" | "blue" | "green" | "yellow" | "orange" | "purple" | "pink";

const ALL_COLORS: Color[] = [
    "red", "blue", "green", "yellow", "orange", "purple", "pink"
];

const COLORS: Record<Color, string> = {
    red: "#f50a0a",
    blue: "#1d6ef0",
    green: "#0be316",
    yellow: "#ecf714",
    orange: "#fc8700",
    purple: "#900cad",
    pink: "#ed07c3"
};

const shuffle = <T,>(arr: T[]): T[] => {
    const a: T[] = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const ColorMemoryTest: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "showing" | "input" | "over">("idle");
    const [score, setScore] = useState<number>(1);
    const [sequence, setSequence] = useState<Color[]>([]);
    const [userInput, setUserInput] = useState<Color[]>([]);
    const [hearts, setHearts] = useState<number>(3);
    const [currentColor, setCurrentColor] = useState<string>("#f0f0f0");
    const [clickedColors, setClickedColors] = useState<Set<Color>>(new Set());
    const [clickLocked, setClickLocked] = useState<boolean>(false);
    const timers = useRef<number[]>([]);
    const availableColors: Color[] = ALL_COLORS.slice(0, Math.min(score, ALL_COLORS.length));
    const { user: { isAuthenticated } } = useUserContext();

    useEffect(() => {
        if (status !== "showing") return;

        let rawSequence: Color[];
        if (score < 8) {
            rawSequence = shuffle(availableColors).slice(0, availableColors.length);
        } else {
            rawSequence = Array.from({ length: score }, () =>
                availableColors[Math.floor(Math.random() * availableColors.length)]
            );
        }

        const colorCounts: Record<Color, number> = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
            orange: 0,
            purple: 0,
            pink: 0
        };
        rawSequence.forEach(color => {
            colorCounts[color] += 1;
        });

        const displaySequence: string[] = [];
        for (let i = 0; i < rawSequence.length; i++) {
            const current = rawSequence[i];
            const previous = i > 0 ? rawSequence[i - 1] : null;

            if (previous !== null && score >= 8 && i > 0 && current === previous) {
                displaySequence.push("#f0f0f0");
            }

            displaySequence.push(COLORS[current]);

            colorCounts[current]--;
        }

        setSequence(rawSequence);
        setClickedColors(new Set());

        let i = 0;
        const showNext = () => {
            if (i >= displaySequence.length) {
                timers.current.push(window.setTimeout(() => {
                    setCurrentColor("#f0f0f0");
                    setStatus("input");
                }, 400));
                return;
            }

            const color = displaySequence[i];
            setCurrentColor(color);

            timers.current.push(window.setTimeout(() => {
                i++;
                showNext();
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
        setStatus("showing");
    };

    const restartTest = () => {
        setStatus("idle");
    };

    const handleColorClick = (color: Color) => {
        if (status !== "input" || clickLocked) return;

        if (score < 8 && clickedColors.has(color)) return;

        if (score < 8) {
            setClickedColors(prev => new Set(prev).add(color));
        }

        const updatedInput = [...userInput, color];
        setUserInput(updatedInput);

        const correct = sequence[updatedInput.length - 1] === color;
        if (!correct) {
            const remaining = hearts - 1;
            setHearts(remaining);
            setClickLocked(true);

            timers.current.push(window.setTimeout(() => {
                if (remaining <= 0) {
                    setStatus("over");
                } else {
                    setUserInput([]);
                    setClickedColors(new Set());
                    setClickLocked(false);
                    setStatus("showing");
                }
            }, 1000));
        } else if (updatedInput.length === sequence.length) {
            timers.current.push(window.setTimeout(() => {
                setScore(prev => prev + 1);
                setUserInput([]);
                setClickedColors(new Set());
                setStatus("showing");
            }, 500));
        }
    }

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }

        try {
            const response = await customFetch.post('/api/submit/', {
                score: score - 1,
                created_at: new Date(),
                test_name: 'color-memory'
            });
            console.log(response);
        } catch (err) {
            catchAxiosError(err);
        }
    }

    return (
        <>
            <TestArea onClick={startTest} clickable={status === "idle"}>
                {status === "idle" && (
                    <IntroScreen
                        title="Color Memory Test"
                        description="What's the longest color sequence you can memorize?" />
                )}

                {status === "showing" && (
                    <div className={styles.sndScreen}>
                        <div
                            className={styles.circle}
                            style={{ backgroundColor: currentColor }} />
                    </div>
                )}

                {status === "input" && (
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
                                        disabled={isClicked} />
                                );
                            })}
                        </div>
                        <Hearts heartsLeft={hearts} />
                    </div>
                )}

                {status === "over" && (
                    <ResultsScreen
                        description={`You remembered at most: ${score - 1} ${score - 1 === 1 ? "color" : "colors"}`}
                        handleRestart={restartTest}
                        onGameEnd={handleGameEnd}
                    />
                )}
            </TestArea>

            <OtherTests currentId="color-memory" />
        </>
    );
};

export default ColorMemoryTest;
