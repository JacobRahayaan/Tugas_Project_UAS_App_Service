import { useState } from "react";
import postService from "../services/postService"; // ✅ PAKAI YANG BERHASIL
import { useNavigate } from "react-router-dom";
import React from "react";
import "../assets/CreatePost.css";

const CreatePost = ({ isLoggedIn, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      if (!file.type.startsWith('image/')) {
        alert("Hanya file gambar yang diizinkan!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB!");
        return;
      }
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLoggedIn) {
      alert("Silahkan login terlebih dahulu!");
      setLoading(false);
      return;
    }

    if (!title || !content) {
      setError("Judul dan konten harus diisi!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      console.log("📤 Mengirim post dengan postService...");
      
      // ✅ PAKAI postService YANG BERHASIL
      const response = await postService.createPost(formData);
      console.log("✅ Response:", response);

      alert("🎉 Postingan berhasil dibuat!");

      // Reset form
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);

      // Callback ke parent
      if (onPostCreated) {
        onPostCreated(response.data || response);
      }

      // Navigate ke home
      navigate("/");

    } catch (err) {
      console.error("❌ Error creating post:", err);
      console.error("📡 Error response:", err.response?.data);
      
      setError(err.response?.data?.message || "Gagal membuat postingan");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "50px",
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <h2>🔐 Akses Ditolak</h2>
        <p>Anda harus login untuk membuat postingan.</p>
        <button 
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Login Sekarang
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "25px",
          marginTop: "0"
        }}>
          Buat Postingan Baru
        </h2>

        {error && (
          <p style={{ 
            color: "red", 
            textAlign: "center",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px"
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Judul *
            </label>
            <input
              type="text"
              value={title}
              placeholder="Judul postingan"
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "12px", 
                border: "1px solid #ddd", 
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Isi Postingan *
            </label>
            <textarea
              value={content}
              placeholder="Tulis isi postingan..."
              onChange={(e) => setContent(e.target.value)}
              required
              rows="5"
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "12px", 
                border: "1px solid #ddd", 
                borderRadius: "5px",
                boxSizing: "border-box",
                resize: "vertical"
              }}
            ></textarea>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Gambar (opsional)
            </label>
            <input 
              type="file" 
              onChange={handleImage}
              disabled={loading}
              style={{ width: "100%" }}
              accept="image/*"
            />

            {preview && (
              <div style={{ position: "relative", marginTop: "15px" }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer"
                  }}
                >
                  ×
                </button>
              </div>
            )}
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
              cursor: loading ? "not-allowed" : "pointer",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            {loading ? "🔄 Mempublikasikan..." : "📢 Publikasikan Postingan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;