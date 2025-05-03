import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/LoginPage.tsx";
import RegisterPage from './pages/RegisterPage.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App
