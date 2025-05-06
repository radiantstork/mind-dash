import { Link } from "react-router-dom";
import styles from "./Home.module.css";

interface TestCardData {
    title: string;
    description1: string;
    description2: string;
    route: string;
    icon?: string; // Optional: add emoji/icons
}

const testCards: TestCardData[] = [
    {
        title: "Time Perception Test ⏱️",
        description1:
            "Do you think that you can accurately measure time, without the use of a watch or a timer?",
        description2:
            "Practice by trying to measure periods of time between 5 and 10 seconds!",
        route: "/time-perception",
    },

    {
        title: "Click Speed Test 🖱️",
        description1:
            "How quickly can you reach 50 clicks? Test your speed and improve your technique!",
        description2:
            "If you can consistently reach 10 clicks per second, that's already amazing!",
        route: "/click-speed",
    },

    {
        title: "Verbal Memory Test 🧠",
        description1:
            "Can you remember which words you've seen before? Put your verbal memory to the test.",
        description2:
            "How many words does it take for you to lose track of what you've already seen?",
        route: "/verbal-memory",
    },

    {
        title: "Color Memory Test 🎨",
        description1:
            "Memorize a sequence of colors and try to reproduce it from start to finish.",
        description2:
            "There's only seven colors, but those colors may keep repeating!",
        route: "/color-memory",
    },

    {
        title: "Language Dexterity Test ✍️",
        description1:
            "Under time pressure, can you identify a word that contains a given group of letters?",
        description2:
            "You and a friend should try to see who can find the most complicated words!",
        route: "/language-dexterity",
    },

    {
        title: "Number Memory Test 🔢",
        description1:
            "You're supposed to remember a number, but the number of digits keeps on increasing...",
        description2:
            "If somebody told you their phone number, could you remember it on the first attempt?",
        route: "/number-memory",
    },
];

export default function Home() {
    return (
        <div className={styles.homePage}>
            <section className={styles.introduction}>
                <h1 className={styles.title}>Welcome to Mind Dash!</h1>
                    <p className={styles.description}>
                        A place where you can sharpen up your cognitive skills, such as visual or verbal memory,
                        pattern recognition, time perception & more! Explore various tests, set high scores, see how 
                        you compare to other people and try to beat our personal high scores.
                    </p>
                </section>

                <section className={styles.testGrid}>
                    {testCards.map(({ title, description1, description2, route }) => (
                        <Link to={route} className={styles.testCard} key={title}>
                            <h1 className={styles.testTitle}>{title}</h1>
                            <div className={styles.testDescription}>
                                <p className={styles.fstTestDesc}>{description1}</p>
                                <p className={styles.sndTestDesc}>{description2}</p>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
    );
}
