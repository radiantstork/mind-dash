import { useEffect, useState } from "react";
import styles from "./ClickSpeedTest.module.css";

const ClickSpeedTest: React.FC = () => {
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsRunning(false);
                        setHasFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleClick = () => {
        if (!isRunning && !hasFinished) {
            setIsRunning(true);
            setTimeLeft(10);
            setClicks(1);
        } else if (isRunning) {
            setClicks(prev => prev + 1);
        }
    };

    const restartTest = () => {
        setClicks(0);
        setTimeLeft(10);
        setIsRunning(false);
        setHasFinished(false);
    };

    const clicksPerSec = parseFloat((clicks / 10).toFixed(2));

    return (
        <div className={styles.pageWrapper}>
            <section className={styles.testBanner} onClick={handleClick}>
                {isRunning && !hasFinished && (
                    <>
                        <p className={styles.clickText}>
                            Click me!
                        </p>

                        <p className={styles.counter}>
                            Clicks: {clicks}
                        </p>


                    </>
                )}

                {!isRunning && !hasFinished && (
                    <>
                        <h1 className={styles.title}>Click Speed Test</h1>
                        <div className={styles.description}>
                            <p>Click as fast as you can for ten seconds.</p>
                            <p>To begin, click anywhere.</p>
                        </div>
                    </>
                )}

                {hasFinished && (
                    <>
                        <p className={styles.result}>Clicks per second: {clicksPerSec}</p>

                        <button onClick={restartTest} className={styles.restartButton}>
                            Restart Test
                        </button>
                    </>
                )}
            </section>

            {/* SIDE BY SIDE SECTIONS */}
            <section className={styles.flexSection}>
                {/* Left: How to play */}
                <div className={styles.sideBox}>
                    <h2>Cum se joacă?</h2>
                    <p>Apasă pe butonul „Click Me” și încearcă să dai cât mai multe click-uri în 10 secunde.</p>
                    <ul>
                        <li>🖱️ Click pe buton pentru a începe</li>
                        <li>⏱️ Cronometrul începe automat</li>
                        <li>🔥 Click cât mai repede posibil</li>
                        <li>📊 Rezultatul va apărea la final</li>
                    </ul>
                </div>

                {/* Right: Stats placeholder */}
                <div className={styles.sideBox}>
                    <h2>Statistici & Progres</h2>
                    <div className={styles.chartPlaceholder}>
                        📈 Aici vor fi afișate graficele tale viitoare.
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ClickSpeedTest;
