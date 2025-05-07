import React from "react";
import Background from "./Background/Background.tsx";
import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import styles from "./DarkTheme.module.css"

const DarkTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Background>
      <Header />
      <main className={styles.container}>
        {children}
      </main>
      <Footer />
    </Background>
  );
};

export default DarkTheme;
