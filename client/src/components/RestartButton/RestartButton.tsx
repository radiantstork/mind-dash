// import React from "react";
import styles from "./RestartButton.module.css";

type Props = {
    onClick: () => void;
};

const RestartButton: React.FC<Props> = ({ onClick }) => (
    <button className={styles.restartButton} onClick={onClick}>
        Restart Test
    </button>
);

export default RestartButton;
