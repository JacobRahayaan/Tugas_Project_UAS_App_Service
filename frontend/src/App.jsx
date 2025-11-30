import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import Dashboard from "./pages/Dashboard";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status from localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {/* ✅ NAVBAR DENGAN LOGIN STATE */}
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <div style={{ padding: "20px", minHeight: "80vh" }}>
          <Routes>
            {/* ✅ PUBLIC ROUTES */}
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/register" element={<Register onRegister={() => setIsLoggedIn(true)} />} />
            <Route path="/post/:id" element={<PostDetail isLoggedIn={isLoggedIn} />} />

            
            {/* ✅ PROTECTED ROUTES */}
            <Route path="/create" element={<CreatePost isLoggedIn={isLoggedIn} />} />
            <Route path="/edit/:id" element={<EditPost isLoggedIn={isLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} />} />
            
            {/* ✅ 404 PAGE - Optional */}
            <Route path="*" element={
              <div style={{ 
                textAlign: 'center', 
                padding: '50px' 
              }}>
                <h1>404 - Halaman Tidak Ditemukan</h1>
                <p>Halaman yang Anda cari tidak ada.</p>
              </div>
            } />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;