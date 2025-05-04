import './App.css';
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import Home from "./pages/Home";
import Login from "./pages/Login";
import TimePerceptionTest from "./pages/TimePerceptionTest/TimePerceptionTest.tsx";
import WordGuessingTest from './pages/WordGuessingTest/WordGuessingTest.tsx';
import ClickSpeedTest from './pages/ClickSpeedTest/ClickSpeedTest.tsx';
import NumberMemoryTest from './pages/NumberMemoryTest/NumberMemoryTest.tsx';

function App() {
  return (
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/time-perception" element={<TimePerceptionTest />} />
        <Route path="/word-guessing" element={<WordGuessingTest />} />
        <Route path="/click-speed" element={<ClickSpeedTest />} />
        <Route path="/number-memory" element={<NumberMemoryTest />} />
      </Routes>
    </Layout>
    </>
  );
}

export default App;
