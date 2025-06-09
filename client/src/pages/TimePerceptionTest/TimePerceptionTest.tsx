import { useEffect, useState } from 'react';

import styles from "./TimePerceptionTest.module.css";
import TestArea from "../../components/TestArea/TestArea.tsx";
import IntroScreen from '../../components/IntroScreen/IntroScreen.tsx';
import ResultsScreen from '../../components/ResultsScreen/ResultsScreen.tsx';
import OtherTests from '../../components/OtherTests/OtherTests.tsx';
import { catchAxiosError } from '../../services/catch_axios_error.ts';
import customFetch from '../../services/custom_fetch.ts';
import { useUserContext } from '../../context/UserContext.tsx';
import { RequestBody, TimePerceptionPayload } from '../../components/Score.ts';

type GameStatus = "idle" | "running" | "over";

class GameStatusObserver {
    private subscribers: ((state: GameStatus) => void)[] = [];
    private currentState: GameStatus = 'idle';
    private setCurrentState : React.Dispatch<React.SetStateAction<GameStatus>> | null = null

    addCurrentStateCallback(callback: React.Dispatch<React.SetStateAction<GameStatus>>) {
        this.setCurrentState = callback;
    }

    subscribe(callback: (state: GameStatus) => void) {
        this.subscribers.push(callback);
        callback(this.currentState);
    }

    setState(newState: GameStatus) {
        if (this.setCurrentState) {
            this.setCurrentState(newState);
            this.subscribers.forEach(cb => cb(newState));
        }
    }
}

const gameStatusObserver = new GameStatusObserver();

const TimePerceptionTest: React.FC = () => {
    const [status, setStatus] = useState<GameStatus>("idle");
    const [targetTime, setTargetTime] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [clickTime, setClickTime] = useState<number | null>(null);
    const { user: { isAuthenticated } } = useUserContext();

    useEffect(() => {
        gameStatusObserver.addCurrentStateCallback(setStatus);

        gameStatusObserver.subscribe((state) => {
            handleClickTimeChange(state);
        });

        gameStatusObserver.subscribe((state) => {
            handleStartTimeChange(state);
        });

        gameStatusObserver.subscribe((state) => {
            handleTargetTimeChange(state);
        });
    }, []);

    function handleTargetTimeChange(current_status: GameStatus) {
        if (current_status === 'idle') {
            setTargetTime(null);
        } else if (current_status === 'running') {
            const currentWaitTime = (Math.floor(Math.random() * 6) + 5) * 1000;
            setTargetTime(currentWaitTime + Date.now());
        }
    }

    function handleClickTimeChange(current_status: GameStatus) {
        if (current_status === 'idle') {
            setClickTime(null);
        } else if (current_status === 'over') {
            setClickTime(Date.now());
        }
    }

    function handleStartTimeChange(current_status: GameStatus) {
        if (current_status === 'idle') {
            setStartTime(null);
        } else if (current_status === 'running') {
            setStartTime(Date.now());
        }
    }
    const handleClick = () => {
        if (status === "idle") {
            gameStatusObserver.setState('running');
        } else if (status === "running" && startTime) {
            gameStatusObserver.setState('over');
        }
    };

    const restartTest = () => {
        gameStatusObserver.setState('idle');
    };

    async function handleGameEnd() {
        if (!isAuthenticated) {
            return;
        }

        try {
            if (clickTime === null) {
                throw new Error("System error: Click time is null");
            }

            if (targetTime === null) {
                throw new Error("System error: Wait time is null");
            }

            if (startTime === null) {
                throw new Error("System error: Start time is null");
            }

            const generator = new RequestBody(new TimePerceptionPayload);
            const response = await customFetch.post('/api/submit/', generator.getBody({
                start_time: startTime,
                click_time: clickTime,
                target_time: targetTime
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
                        title="Time Perception Test"
                        description="How accurately can you estimate time without a watch?" />
                )}

                {status === "running" && targetTime && startTime && (
                    <>
                        <h1 className={styles.time}>
                            {(targetTime - startTime) / 1000} seconds
                        </h1>

                        <div className={styles.text}>
                            <p>
                                Click when the time is up
                            </p>
                        </div>
                    </>
                )}

                {status === "over" && clickTime && targetTime && startTime && (
                    <ResultsScreen
                        description={`You estimated: ${((clickTime - startTime) / 1000).toFixed(2)} seconds (off by ${Math.abs((clickTime - targetTime) / 1000).toFixed(2)})`}
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