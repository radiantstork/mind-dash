import React from 'react';
import styles from './CosmicArea.module.css';

interface CosmicAreaProps {
  children: React.ReactNode;
  starCount?: number;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const CosmicArea: React.FC<CosmicAreaProps> = ({ children, starCount = 100 }) => {
  const stars = Array.from({ length: starCount }).map((_, i) => {
    const size = getRandom(1, 3);
    const top = getRandom(0, 100);
    const left = getRandom(0, 100);
    const blur = getRandom(1, 2);

    const style: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}%`,
      left: `${left}%`,
      filter: `blur(${blur}px)`,
      position: 'absolute',
    };

    return <div key={i} className={styles.star} style={style} />;
  });

  return (
    <div className={styles.cosmicArea}>
      {stars}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default CosmicArea;
