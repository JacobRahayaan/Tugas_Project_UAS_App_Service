import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      setLoading(false);
      return;
    }

    try {
      await authService.register(form.name, form.email, form.password);
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mendaftar, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
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
          Daftar Akun
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
        
        {success && (
          <p style={{ 
            color: "green", 
            textAlign: "center",
            backgroundColor: "#e6ffe6",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px",
              fontWeight: "500"
            }}>
              Nama Lengkap
            </label>
            <input
              name="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={handleChange}
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px",
              fontWeight: "500"
            }}>
              Alamat Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={handleChange}
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

          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px",
              fontWeight: "500"
            }}>
              Kata Sandi
            </label>
            <input
              name="password"
              type="password"
              placeholder="Masukkan kata sandi"
              value={form.password}
              onChange={handleChange}
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
              Konfirmasi Kata Sandi
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Masukkan ulang kata sandi"
              value={form.confirmPassword}
              onChange={handleChange}
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
            {loading ? "🔄 Memproses..." : "Daftar"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          Sudah punya akun?{" "}
          <a 
            href="/login" 
            style={{ color: "blue", textDecoration: "none", fontWeight: "500" }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;