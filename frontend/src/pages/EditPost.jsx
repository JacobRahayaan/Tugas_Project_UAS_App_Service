import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postService from "../services/postService";
import React from "react";
import "../assets/EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // === Ambil data post lama ===
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        console.log("🔄 Loading post for edit:", id);
        
        const res = await postService.getPostById(id);
        console.log("✅ Post data received:", res);
        
        // ✅ HANDLE BOTH RESPONSE STRUCTURES
        let postData;
        if (res.data && res.data.data) {
          postData = res.data.data;
        } else if (res.data) {
          postData = res.data;
        } else {
          postData = res;
        }
        
        console.log("📝 Post to edit:", postData);
        
        setTitle(postData.title || "");
        setContent(postData.content || "");
        setPreview(postData.imageUrl || "");
        
      } catch (err) {
        console.error("❌ Error loading post:", err);
        setError("Gagal memuat data post.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // === SIMPLE HANDLE SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdating(true);

    if (!title || !content) {
      setError("Judul dan konten harus diisi!");
      setUpdating(false);
      return;
    }

    try {
      console.log("📤 Starting update...");
      
      // ✅ UPDATE CONTENT SAJA (GAMBAR TIDAK BISA DIUPDATE)
      const jsonData = { 
        title: title, 
        content: content 
      };
      
      console.log("📦 Sending JSON data:", jsonData);
      
      const response = await postService.updatePost(id, jsonData);
      console.log("✅ Update success:", response);

      alert("✅ Postingan berhasil diupdate!\n\nℹ️ Gambar tidak dapat diubah. Buat post baru untuk gambar yang berbeda.");
      navigate(`/post/${id}`);
      
    } catch (err) {
      console.error("❌ Update error:", err);
      console.error("📡 Error details:", err.response?.data);
      
      setError(err.response?.data?.message || "Gagal mengupdate post");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        fontSize: "18px"
      }}>
        <p>🔄 Loading post...</p>
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
        maxWidth: "600px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          marginBottom: "25px",
          marginTop: "0",
          fontSize: "28px",
          color: "#333"
        }}>
          ✏️ Edit Postingan
        </h1>

        {error && (
          <div style={{
            background: "#ffe6e6",
            color: "#d00",
            padding: "12px",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "20px",
            border: "1px solid #ffcccc"
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* JUDUL */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              fontSize: "14px",
              color: "#333"
            }}>
              Judul *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={updating}
              placeholder="Masukkan judul postingan"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
                fontSize: "16px"
              }}
            />
          </div>

          {/* KONTEN */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              fontSize: "14px",
              color: "#333"
            }}>
              Konten *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={updating}
              placeholder="Tulis konten postingan di sini..."
              rows="8"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                boxSizing: "border-box",
                fontSize: "16px",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* PREVIEW GAMBAR SAAT INI */}
          {preview && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                fontSize: "14px",
                color: "#333"
              }}>
                Gambar Saat Ini 🔒
              </label>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd"
                }}
              />
              <div style={{ 
                marginTop: "8px", 
                padding: "8px", 
                background: "#f8f9fa", 
                borderRadius: "4px",
                fontSize: "12px",
                color: "#666",
                textAlign: "center"
              }}>
                🔒 Gambar tidak dapat diubah. Buat post baru untuk gambar berbeda.
              </div>
            </div>
          )}

          {/* UPLOAD GAMBAR BARU - DISABLED */}
          {!preview && (
            <div style={{ marginBottom: "25px", opacity: 0.6 }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                fontWeight: "600",
                fontSize: "14px",
                color: "#333"
              }}>
                Tambah Gambar <span style={{ color: "#dc3545", fontSize: "12px" }}> (Tidak Tersedia)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={true}
                style={{ 
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  backgroundColor: "#f9f9f9"
                }}
              />
              <div style={{ 
                marginTop: "8px", 
                padding: "10px", 
                background: "#f8f9fa", 
                borderRadius: "6px",
                fontSize: "12px",
                color: "#666",
                textAlign: "center"
              }}>
                🔒 Fitur tambah gambar tidak tersedia untuk edit post.
              </div>
            </div>
          )}

          {/* TOMBOL ACTION */}
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={updating}
              style={{
                padding: "12px 24px",
                background: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: updating ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                flex: 1
              }}
            >
              Batal
            </button>
            
            <button
              type="submit"
              disabled={updating}
              style={{
                padding: "12px 24px",
                background: updating ? "#666" : "black",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: updating ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                flex: 2
              }}
            >
              {updating ? "🔄 Menyimpan..." : "💾 Simpan Perubahan"}
            </button>
          </div>
        </form>

        {/* INFO BOX */}
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          background: "#e7f3ff", 
          borderRadius: "6px",
          fontSize: "13px",
          color: "#0066cc",
          border: "1px solid #b3d9ff"
        }}>
          <strong>💡 Info:</strong> 
          <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
            <li>Edit post hanya untuk judul dan konten</li>
            <li>Gambar tidak dapat diubah setelah post dibuat</li>
            <li>Buat post baru jika ingin gambar yang berbeda</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPost;