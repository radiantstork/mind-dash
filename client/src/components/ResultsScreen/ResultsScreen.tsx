import RestartButton from "../RestartButton/RestartButton";
import styles from "./ResultsScreen.module.css";

type Props = {
    description: string;
    handleRestart: () => void;
};

const ResultsScreen: React.FC<Props> = ({ description, handleRestart }) => (
    <div className={styles.container}>
        <h1 className={styles.title}>
            Your Result
        </h1>

        <p className={styles.description}>
            {description}
        </p>

        <RestartButton onClick={handleRestart} />
    </div>
);

export default ResultsScreen;
