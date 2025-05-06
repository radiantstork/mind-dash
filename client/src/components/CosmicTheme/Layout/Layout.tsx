import React from "react";
import Header from "../Header/Header.tsx";
import Footer from "../Footer/Footer.tsx";
import Background from "../Background/Background.tsx";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export default Layout;
