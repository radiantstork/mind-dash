import { useEffect, useRef } from "react";
import RestartButton from "../RestartButton/RestartButton";
import styles from "./ResultsScreen.module.css";

type Props = {
    description: string;
    handleRestart: () => void;
    onGameEnd: () => Promise<unknown>;
};

const ResultsScreen: React.FC<Props> = ({ description, handleRestart, onGameEnd }) => {
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        (async () => {
            await onGameEnd();
        })();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Your Result
            </h1>

            <p className={styles.description} id="results-screen">
                {description}
            </p>

            <RestartButton onClick={handleRestart} />
        </div>
    );
}
export default ResultsScreen;
