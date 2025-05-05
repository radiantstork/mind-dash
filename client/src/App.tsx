import './App.css';
import { Routes, Route } from "react-router-dom";

// import CosmicTheme from "./components/CosmicTheme/Layout/Layout.tsx";
import DarkTheme from "./components/DarkTheme/DarkTheme.tsx";

import Home from "./pages/Home";
import Login from "./pages/Login";

import TimePerceptionTest from "./pages/TimePerceptionTest/TimePerceptionTest.tsx";
import LanguageDexterityTest from "./pages/LanguageDexterityTest/LanguageDexterityTest.tsx";
import ClickSpeedTest from "./pages/ClickSpeedTest/ClickSpeedTest.tsx";
import NumberMemoryTest from './pages/NumberMemoryTest/NumberMemoryTest.tsx';
import ColorMemoryTest from './pages/ColorMemoryTest/ColorMemoryTest.tsx';

function App() {
  return (
    <>
    <DarkTheme>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/time-perception" element={<TimePerceptionTest />} />
        <Route path="/language-dexterity" element={<LanguageDexterityTest />} />
        <Route path="/click-speed" element={<ClickSpeedTest />} />
        <Route path="/number-memory" element={<NumberMemoryTest />} />
        <Route path="/color-memory" element={<ColorMemoryTest />} />
      </Routes>
    </DarkTheme>
    </>
  );
}

export default App;
