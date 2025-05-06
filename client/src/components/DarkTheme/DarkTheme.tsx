import React from "react";
import Background from "./Background/Background.tsx";
import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";

const DarkTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Background>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </Background>
  );
};

export default DarkTheme;
