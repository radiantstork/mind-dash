import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login.tsx";
import VerbalMemory from "./pages/VerbalMemory.tsx";
import ChimpTest from "./pages/ChimpTest.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
        <Route path="/verbal-memory" element={<VerbalMemory />} />
    <Route path="/chimp-test" element={<ChimpTest />} />

    </Routes>
  );
}

export default App
