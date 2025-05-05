// bug: test area is clickable in the results screen

import { useState } from 'react';

import styles from "./TimePerceptionTest.module.css";
import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from '../../components/IntroScreen/IntroScreen.tsx';
import ResultsScreen from '../../components/ResultsScreen/ResultsScreen.tsx';

const TimePerceptionTest: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [score, setScore] = useState<number | null>(null);

    const handleClick = () => {
        if (status === "idle") {
            setStatus("running");
            setStartTime(Date.now());
        } else if (status === "running" && startTime) {
            const result = (Date.now() - startTime) / 1000;
            setScore(result);
            setStatus("over");
        }       
    };

    const restartTest = () => {
        setStatus("idle");
        setStartTime(null);
        setScore(null);
    };

    return (
        <TestArea onClick={handleClick} clickable={status === "idle" || status === "running"}>
            {status === "idle" && (
                <IntroScreen 
                    title="Time Perception Test" 
                    description="How accurately can you estimate time without a watch?" />
            )}

            {status === "running" && (
                <>
                    <h1 className={styles.time}>
                        5 seconds
                    </h1>

                    <div className={styles.text}>
                        <p>
                            Click when the time is up
                        </p>
                    </div>
                </>
            )}

            {status === "over" && score !== null && (
                <ResultsScreen 
                    description={`You estimated: ${score.toFixed(2)} seconds (off by ${Math.abs(score - 5).toFixed(2)})`} 
                    handleRestart={restartTest} />
            )}
        </TestArea>
    );
};

export default TimePerceptionTest;
