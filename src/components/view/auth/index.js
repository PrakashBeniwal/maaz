import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import auth components
import Login from './login';
import Register from './register';
import ResetPassword from './reset-password';
import VerifyEmail from './verify';

const Auth = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyEmail />} />
      
    </Routes>
  );
};

export default Auth;
