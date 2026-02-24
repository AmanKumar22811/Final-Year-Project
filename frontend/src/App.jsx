import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UploadFingerprint from './pages/UploadFingerprint';
import Result from './pages/Result';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/upload" element={<UploadFingerprint />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;
