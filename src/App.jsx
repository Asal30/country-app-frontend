import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/homePage";
import LoginPage from "./components/pages/login";
import RegisterPage from "./components/pages/register";
import Header from "./components/header/header";
import { Navigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [role, setRole] = useState(sessionStorage.getItem('role') || '');

  useEffect(() => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);

    window.onbeforeunload = () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, [token, role]);

  

  const logout = () => {
    setToken('');
    setRole('');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  };
  return (
    <BrowserRouter>
      <Header token={token} logout={logout} role={role}/>
      <Routes>
        <Route path="/dashboard" element={<HomePage token={token} />} />
        <Route path="/login" element={!token ? <LoginPage setToken={setToken} setRole={setRole} /> : <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} />} />
        <Route path="/*" element={<Navigate to={token ? (role === 'admin' ? '/admin' : '/dashboard') : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;