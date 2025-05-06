import './App.css';
import { Routes, Route } from "react-router-dom";

import DarkTheme from "./components/DarkTheme/DarkTheme.tsx";

import Home from "./pages/Home.tsx";
import Login from "./pages/Login";
import ScrollToTop from './components/ScrollToTop.tsx';

import TimePerceptionTest from "./pages/TimePerceptionTest/TimePerceptionTest.tsx";
import LanguageDexterityTest from "./pages/LanguageDexterityTest/LanguageDexterityTest.tsx";
import ClickSpeedTest from "./pages/ClickSpeedTest/ClickSpeedTest.tsx";
import NumberMemoryTest from './pages/NumberMemoryTest/NumberMemoryTest.tsx';
import ColorMemoryTest from './pages/ColorMemoryTest/ColorMemoryTest.tsx';
import VerbalMemoryTest from './pages/VerbalMemoryTest/VerbalMemoryTest.tsx';

function App() {
  return (
    <>
    <DarkTheme>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/time-perception" element={<TimePerceptionTest />} />
        <Route path="/language-dexterity" element={<LanguageDexterityTest />} />
        <Route path="/click-speed" element={<ClickSpeedTest />} />
        <Route path="/number-memory" element={<NumberMemoryTest />} />
        <Route path="/color-memory" element={<ColorMemoryTest />} />
        <Route path="/verbal-memory" element={<VerbalMemoryTest />} />
      </Routes>
    </DarkTheme>
    </>
  );
}

export default App;
