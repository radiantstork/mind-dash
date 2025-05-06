import styles from './GameIntro.module.css'; // Create this CSS module file

type GameIntroProps = {
  onGameStart: () => void
};

const GameIntro = ({ onGameStart }: GameIntroProps) => {

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Visual Memory Test</h2>
        <div className={styles.instructions}>
          <p>Test your visual memory skills!</p>
          <ul className={styles.tipsList}>
            <li>Memorize the highlighted pattern</li>
            <li>Click the correct tiles after they disappear</li>
            <li>Avoid wrong clicks - they count against your score</li>
            <li>Difficulty increases with each level</li>
          </ul>
        </div>
        
        <button 
          className={styles.startButton}
          onClick={onGameStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameIntro;