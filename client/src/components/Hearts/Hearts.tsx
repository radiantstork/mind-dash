import styles from "./Hearts.module.css";

interface HeartsProps {
    heartsLeft: number;
    totalHearts?: number;
}

const Hearts: React.FC<HeartsProps> = ({ heartsLeft, totalHearts = 3 }) => {
    return (
        <div className={styles.hearts}>
            {Array.from({ length: totalHearts }, (_, i) => (
                <span key={i} className={`${styles.heart} ${i >= heartsLeft ? styles.lost : ""}`}>❤️</span>
            ))}
        </div>
    );
};

export default Hearts;
