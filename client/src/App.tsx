import './App.css';
import { Routes, Route } from "react-router-dom";

import DarkTheme from "./components/DarkTheme/DarkTheme.tsx";

import Home from "./pages/Home.tsx";
import Login from "./pages/LoginPage.tsx";
import ScrollToTop from './components/ScrollToTop.tsx';

import TimePerceptionTest from "./pages/TimePerceptionTest/TimePerceptionTest.tsx";
import LanguageDexterityTest from "./pages/LanguageDexterityTest/LanguageDexterityTest.tsx";
import ClickSpeedTest from "./pages/ClickSpeedTest/ClickSpeedTest.tsx";
import NumberMemoryTest from './pages/NumberMemoryTest/NumberMemoryTest.tsx';
import ColorMemoryTest from './pages/ColorMemoryTest/ColorMemoryTest.tsx';
import VerbalMemoryTest from './pages/VerbalMemoryTest/VerbalMemoryTest.tsx';
//import VerbalMemory from "./pages/VerbalMemory.tsx";
//import ChimpTest from "./pages/ChimpTest.tsx";
//import RegisterPage from './pages/RegisterPage.tsx';
import VisualMemory from './pages/VisualMemoryTest/VisualMemory.tsx';
import { ToastContainer } from 'react-toastify';
import RegisterPage from './pages/RegisterPage.tsx';
import StatisticsPage from './pages/Statistics.tsx';

function App() {
  return (<div>
    <DarkTheme>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/time-perception" element={<TimePerceptionTest />} />
        <Route path="/language-dexterity" element={<LanguageDexterityTest />} />
        <Route path="/click-speed" element={<ClickSpeedTest />} />
        <Route path="/number-memory" element={<NumberMemoryTest />} />
        <Route path="/color-memory" element={<ColorMemoryTest />} />
        <Route path="/verbal-memory" element={<VerbalMemoryTest />} />
        <Route path="/visual-memory" element={<VisualMemory />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </DarkTheme>
  </div>
  );
}

export default App
