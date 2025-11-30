import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard User</h1>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        margin: "30px 0"
      }}>
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h3>👤</h3>
          <p>Profile User</p>
        </div>
        
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <h3>✅</h3>
          <p>Status: Active</p>
        </div>
      </div>

      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3>Informasi Akun</h3>
        <p><strong>Nama:</strong> {user.name || "-"}</p>
        <p><strong>Email:</strong> {user.email || "-"}</p>
        <p><strong>Login Time:</strong> {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}