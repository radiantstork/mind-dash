import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import { UserProvider } from './context/UserContext.tsx';

console.log(axios.get('http://127.0.0.1:8000/api/').then(res => res.data))

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <UserProvider>
        <App />
      </UserProvider>
    </StrictMode>
  </BrowserRouter>
)
