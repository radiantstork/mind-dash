import React, { useEffect, useRef } from "react";
import styles from "./TestArea.module.css";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    clickable?: boolean;
};

const TestArea: React.FC<Props> = ({ children, onClick, clickable = false }) => {
    const areaRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (clickable && areaRef.current) {
    //         console.log('Focused');
            
    //         areaRef.current.focus();
    //     }
    // }, [clickable]);

    return (
        <div
            className={`${styles.testArea} ${clickable ? styles.clickable : ""}`}
            // tabIndex={0}
            // ref={areaRef}
            // role="button"
            // onKeyDown={(e) => {
            //     console.log(e.key);
            //     if (e.key === 'Enter' && onClick && clickable) {
            //         onClick();
            //     }
            // }}
            onClick={clickable ? onClick : undefined}>
            {children}
        </div>
    );
};

export default TestArea;