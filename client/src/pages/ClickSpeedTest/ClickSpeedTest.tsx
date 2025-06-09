import { useState } from "react";

import styles from "./ClickSpeedTestDefault.module.css";

import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from "../../components/IntroScreen/IntroScreen.tsx";
import ResultsScreen from "../../components/ResultsScreen/ResultsScreen.tsx";
import OtherTests from "../../components/OtherTests/OtherTests.tsx";
import { useUserContext } from "../../context/UserContext.tsx";
import { catchAxiosError } from "../../services/catch_axios_error.ts";
import customFetch from "../../services/custom_fetch.ts";
import { ClickSpeedPayload, RequestBody } from "../../components/Score.ts";

const ClickSpeedTest: React.FC = () => {
    const [clicks, setClicks] = useState<number>(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number | null>(null);

    const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
    const { user: { isAuthenticated } } = useUserContext();

    const handleClick = () => {
        if (status === "idle") {
            const now = Date.now();
            setStatus("running");
            setStartTime(now);
            setClicks(1);
        } else if (status === "running") {
            setClicks(prev => {
                const newCount = prev + 1;
                if (newCount >= 50 && startTime !== null) {
                    const duration = (Date.now() - startTime) / 1000;
                    setElapsedTime(duration);
                    setStatus("over");
                }
                return newCount;
            });
        }
    };

    const restartTest = () => {
        setClicks(0);
        setStatus("idle");
        setStartTime(null);
        setElapsedTime(null);
    };

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }
        
        const generator = new RequestBody(new ClickSpeedPayload())
        try {
            if (elapsedTime === null) {
                throw new Error("System error: Elapsed time is null");
            }
            const response = await customFetch.post('/api/submit/', generator.getBody({
                clicks,
                elapsed_time: elapsedTime
            }));
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
                        title="Click Speed Test"
                        description="How fast can you click 50 times?" />
                )}

                {status === "running" && (
                    <>
                        <p className={styles.clickText}>
                            Click me!
                        </p>

                        <p className={styles.counter}>
                            Clicks: {clicks}
                        </p>
                    </>
                )}

                {status === "over" && (
                    <ResultsScreen
                        description={`Clicks per second: ${elapsedTime ? (clicks / elapsedTime).toFixed(2) : "0.00"}`}
                        handleRestart={restartTest}
                        onGameEnd={handleGameEnd}
                    />
                )}

            </TestArea>

            <OtherTests currentId="click-speed" />
        </>
    );
};

export default ClickSpeedTest;
