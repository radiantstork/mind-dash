import styles from "./Background.module.css";
import React from "react";

interface BackgroundProps {
    children: React.ReactNode;
    starCount?: number;
}

const getRandom = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

const Background: React.FC<BackgroundProps> = ({ children, starCount = 127 }) => {
    const stars = Array.from({ length: starCount }).map((_, i) => {
        const size = getRandom(1, 4); // px
        const top = getRandom(0, 100); // %
        const left = getRandom(0, 100); // %
        const blur = getRandom(1, 4); // px
        const opacity = getRandom(0.5, 1); // subtle variation
        
        const style: React.CSSProperties = {
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            filter: `blur(${blur}px)`,
            opacity,
        };
  
        return <div key={i} className={styles.star} style={style} />;
    });
  
    return (
        <div className={styles.background}>
            {stars}
            {children}
        </div>
    );
};
  
export default Background;
