import styles from "./IntroScreen.module.css";

type Props = {
    title: string;
    description: string;
};

const IntroScreen: React.FC<Props> = ({ title, description }) => (
    <div className={styles.container}>
        <h1 className={styles.title}>
            {title}
        </h1>

        <div className={styles.description}>
            <p>{description}</p>
            <p>To begin, click anywhere.</p>
        </div>
    </div>
);

export default IntroScreen;
