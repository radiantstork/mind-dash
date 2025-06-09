import { useState } from 'react';

import styles from "./TimePerceptionTest.module.css";
import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from '../../components/IntroScreen/IntroScreen.tsx';
import ResultsScreen from '../../components/ResultsScreen/ResultsScreen.tsx';
import OtherTests from '../../components/OtherTests/OtherTests.tsx';
import { catchAxiosError } from '../../services/catch_axios_error.ts';
import customFetch from '../../services/custom_fetch.ts';
import { useUserContext } from '../../context/UserContext.tsx';

const TimePerceptionTest: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
    const [waitTime, setWaitTime] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const { user: { isAuthenticated } } = useUserContext();

    const handleClick = () => {
        if (status === "idle") {
            setStatus("running");
            setWaitTime(Math.floor(Math.random() * 6) + 5);
            setStartTime(Date.now());
        } else if (status === "running" && startTime) {
            const result: number = (Date.now() - startTime) / 1000;
            setScore(result);
            setStatus("over");
        }
    };

    const restartTest = () => {
        setStatus("idle");
        setWaitTime(null);
        setStartTime(null);
        setScore(null);
    };

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }

        try {
            if (score === null) {
                throw new Error("System error: Score is null");
            }

            if (waitTime === null) {
                throw new Error("System error: Wait time is null");
            }

            const actual_time = Math.floor(Math.abs(score - waitTime) * 100);
            const response = await customFetch.post('/api/submit/', {
                score: Math.max(10000 - actual_time, 0),
                created_at: new Date(),
                test_name: 'time-perception'
            });
            console.log(response);
        } catch (err) {
            catchAxiosError(err);
        }
    }

    return (
        <>
            <TestArea onClick={handleClick} clickable={status === "idle" || status === "running"}>
                {status === "idle" && (
                    <IntroScreen
                        title="Time Perception Test"
                        description="How accurately can you estimate time without a watch?" />
                )}

                {status === "running" && (
                    <>
                        <h1 className={styles.time}>
                            {waitTime} seconds
                        </h1>

                        <div className={styles.text}>
                            <p>
                                Click when the time is up
                            </p>
                        </div>
                    </>
                )}

                {status === "over" && score !== null && waitTime !== null && (
                    <ResultsScreen
                        description={`You estimated: ${score.toFixed(2)} seconds (off by ${Math.abs(score - waitTime).toFixed(2)})`}
                        handleRestart={restartTest}
                        onGameEnd={handleGameEnd}
                    />
                )}
            </TestArea>

            <OtherTests currentId="time-perception" />
        </>
    );
};

export default TimePerceptionTest;
