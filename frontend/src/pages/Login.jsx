import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      
      if (onLogin) {
        onLogin();
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const token = localStorage.getItem("token");
      
      if (token) {
        navigate("/");
      } else {
        setError("Login gagal: Token tidak tersimpan");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email atau password salah");
      } else if (err.response?.status === 404) {
        setError("Endpoint login tidak ditemukan");
      } else if (err.response?.status === 500) {
        setError("Server error, coba lagi nanti");
      } else if (err.code === "NETWORK_ERROR") {
        setError("Tidak bisa terhubung ke server. Pastikan backend berjalan.");
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f4f4",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          Masuk ke Akun Anda
        </h2>

        {error && (
          <p style={{ 
            color: "red", 
            textAlign: "center",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px",
              fontWeight: "500"
            }}>
              Alamat Email
            </label>
            <input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px",
              fontWeight: "500"
            }}>
              Kata Sandi
            </label>
            <input
              type="password"
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#666" : "black",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {loading ? "🔄 Memproses..." : "Masuk"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          Belum memiliki akun?{" "}
          <a 
            href="/register" 
            style={{ color: "blue", textDecoration: "none", fontWeight: "500" }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;