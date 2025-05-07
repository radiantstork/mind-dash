import React from "react";
import styles from "./TestArea.module.css";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    clickable?: boolean;
};

const TestArea: React.FC<Props> = ({ children, onClick, clickable = false }) => {
    return (
        <div
            className={`${styles.testArea} ${clickable ? styles.clickable : ""}`}
            onClick={clickable ? onClick : undefined}>
            {children}
        </div>
    );
};

export default TestArea;
