import React from "react";
import styles from "./OtherTests.module.css";

type Test = {
    title: string;
    description: string;
    icon: string;
    id: string; 
};

const allTests: Test[] = [
    {
        title: "Click Speed Test",
        description: "How fast can you click?",
        icon: "🖱️",
        id: "click-speed"
    },

    {
        title: "Color Memory Test",
        description: "Remember the color sequence!",
        icon: "🎨",
        id: "color-memory"
    },

    {
        title: "Language Dexterity Test",
        description: "How quickly can you switch?",
        icon: "🧠",
        id: "language-dexterity"
    },

    {
        title: "Number Memory Test",
        description: "How many digits can you recall?",
        icon: "🔢",
        id: "number-memory"
    },

    { 
        title: "Time Perception Test",
        description: "Can you sense time accurately?",
        icon: "⏱️",
        id: "time-perception"
    },

    {
        title: "Verbal Memory Test",
        description: "Can you remember which words you’ve seen?",
        icon: "🗣️",
        id: "verbal-memory"
    },

    // { 
    //     title: "Sample Test",
    //     description: "Sample Description",
    //     icon: "🗣️",
    //     id: "sample",
    // }
];

type Props = {
    currentId: string;
};

const OtherTests: React.FC<Props> = ({ currentId }) => {
    const filteredTests = allTests.filter((test) => test.id !== currentId);

    return (
        <section className={styles.otherTests}>
            <h2>
                Check out other tests as well!
            </h2>

            <div className={styles.testGrid}>
                {filteredTests.map((test, index) => {
                    const isLeft = index % 2 === 0;
                    const cardClass = isLeft ? styles.testCardLeft : styles.testCardRight;

                    return (
                        <a
                            key={test.id}
                            href={`/${test.id}`}
                            className={`${styles.testCard} ${cardClass}`}>

                            <div className={styles.icon}>
                                {test.icon}
                            </div>

                            <div className={styles.info}>
                                <h3>
                                    {test.title}
                                </h3>

                                <p>
                                    {test.description}
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default OtherTests;
