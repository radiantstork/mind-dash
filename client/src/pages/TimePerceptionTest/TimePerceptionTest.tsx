import React, { useState} from 'react';
import styles from "./TimePerceptionTest.module.css"

const TimePerceptionTest: React.FC = () => {
    const [startTime, setStartTime] = useState<number | null>(null);
    const [result, setResult] = useState<number | null>(null);

    const handleButtonClick = () => {
        if (startTime === null) {
            setResult(null);
            setStartTime(Date.now());
        } else {
            const elapsedTime = (Date.now() - startTime) / 1000;
            setResult(elapsedTime);
            setStartTime(null);
        };
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Time Perception Test</h1>

            <button className={styles.button} onClick={handleButtonClick}>
                {startTime === null ? "Start" : "Click after 5 seconds"}
            </button>

            {result !== null && (
                <div className={styles.results}>
                    <p>You waited: {result.toFixed(2)} seconds</p>
                    <p>Difference from 5 seconds: {(Math.abs(result - 5)).toFixed(2)} seconds</p>
                </div>
            )}
        </div>
    );
};

export default TimePerceptionTest;
