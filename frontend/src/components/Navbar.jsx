import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Navbar.css";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
    alert("Logout berhasil!");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* NAVIGATION LINKS */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {isLoggedIn ? (
            // ✅ JIKA SUDAH LOGIN
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/create" className="nav-link">Create Post</Link>
              <Link to="/login" onClick={handleLogout} className="nav-link nav-logout">
                Logout
              </Link>
            </>
          ) : (
            // ✅ JIKA BELUM LOGIN
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;