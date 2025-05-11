import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserDashboard from './components/dashboard/userDashboard';
import AdminDashboard from './components/dashboard/adminDashboard';
import LoginPage from "./components/pages/login";
import RegisterPage from "./components/pages/register";
import Header from "./components/common/header/header";
import { Navigate } from "react-router-dom";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');
  const [role, setRole] = useState(sessionStorage.getItem('role') || '');

  useEffect(() => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
  }, [token, role]);

  const logout = () => {
    setToken('');
    setRole('');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
  };

  return (
    <BrowserRouter>
      <div className='bg-fixed bg-cover' style={{ backgroundImage: `url('/src/assets/background3.jpg')` }}>
        <Header token={token} logout={logout} role={role} />
        {/* Add margin-top to push content below the fixed header */}
        <div className="pt-16">
          <Routes>
            <Route path="/login" element={!token ? <LoginPage setToken={setToken} setRole={setRole} /> : <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} />} />
            <Route path="/admin" element={token && role === 'admin' ? <AdminDashboard token={token} /> : <Navigate to="/login" />} />
            <Route path="/*" element={<UserDashboard token={token} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;