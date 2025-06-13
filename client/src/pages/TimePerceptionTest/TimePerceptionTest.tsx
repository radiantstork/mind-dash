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

/**
 * Observer class to manage and broadcast game status changes.
 */
class GameStatusObserver {
    private subscribers: ((state: GameStatus) => void)[] = [];
    private currentState: GameStatus = 'idle';
    private setCurrentState: React.Dispatch<React.SetStateAction<GameStatus>> | null = null;

    /**
     * Registers the setState function from React to update status state.
     */
    addCurrentStateCallback(callback: React.Dispatch<React.SetStateAction<GameStatus>>) {
        this.setCurrentState = callback;
    }

    /**
     * Subscribes a callback to be called on state changes.
     */
    subscribe(callback: (state: GameStatus) => void) {
        this.subscribers.push(callback);
        callback(this.currentState);
    }

    /**
     * Updates the internal state and notifies all subscribers.
     */
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

    // Subscribe to game status updates and link handlers.
    useEffect(() => {
        gameStatusObserver.addCurrentStateCallback(setStatus);

        gameStatusObserver.subscribe(handleStartTimeUpdate);
        gameStatusObserver.subscribe(handleTargetTimeUpdate);
        gameStatusObserver.subscribe(handleClickTimeUpdate);
    }, []);

    /**
     * Sets the target time when entering "running" state.
     */
    const handleTargetTimeUpdate = (state: GameStatus) => {
        if (state === 'idle') {
            setTargetTime(null);
        } else if (state === 'running') {
            const waitTime = (Math.floor(Math.random() * 6) + 5) * 1000; // 5–10s delay
            setTargetTime(Date.now() + waitTime);
        }
    };

    /**
     * Records start time when transitioning to "running" state.
     */
    const handleStartTimeUpdate = (state: GameStatus) => {
        if (state === 'idle') {
            setStartTime(null);
        } else if (state === 'running') {
            setStartTime(Date.now());
        }
    };

    /**
     * Records click time when test ends.
     */
    const handleClickTimeUpdate = (state: GameStatus) => {
        if (state === 'idle') {
            setClickTime(null);
        } else if (state === 'over') {
            setClickTime(Date.now());
        }
    };

    /**
     * Handles user interaction with the test area.
     */
    const handleClick = () => {
        if (status === "idle") {
            gameStatusObserver.setState("running");
        } else if (status === "running" && startTime) {
            gameStatusObserver.setState("over");
        }
    };

    /**
     * Resets the game to initial state.
     */
    const restartTest = () => {
        gameStatusObserver.setState("idle");
    };

    /**
     * Submits test result when the game ends.
     */
    const handleGameEnd = async () => {
        if (!isAuthenticated) return;

        try {
            if (clickTime === null || startTime === null || targetTime === null) {
                throw new Error("System error: Timing data is missing.");
            }

            const bodyGenerator = new RequestBody(new TimePerceptionPayload());
            const response = await customFetch.post('/api/submit/', bodyGenerator.getBody({
                start_time: startTime,
                click_time: clickTime,
                target_time: targetTime
            }));

            console.log(response);
        } catch (err) {
            catchAxiosError(err);
        }
    };

    return (
        <>
            <TestArea onClick={handleClick} clickable={status === "idle" || status === "running"}>
                {status === "idle" && (
                    <IntroScreen
                        title="Time Perception Test"
                        description="How accurately can you estimate time without a watch?"
                    />
                )}

                {status === "running" && targetTime && startTime && (
                    <>
                        <h1 className={styles.time}>
                            {(targetTime - startTime) / 1000} seconds
                        </h1>
                        <div className={styles.text}>
                            <p>Click when the time is up</p>
                        </div>
                    </>
                )}

                {status === "over" && clickTime && targetTime && startTime && (
                    <ResultsScreen
                        description={`You estimated: ${((clickTime - startTime) / 1000).toFixed(2)} seconds (off by ${Math.abs((clickTime - targetTime) / 1000).toFixed(2)}s)`}
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
