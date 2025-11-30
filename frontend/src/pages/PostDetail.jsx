import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPostById } from "../services/posts";
import postService from "../services/postService";
import React from "react";
import "../assets/PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const res = await getPostById(id);
      
      if (res.data && res.data.data) {
        setPost(res.data.data);
      } else if (res.data) {
        setPost(res.data);
      }
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIMPLE OWNERSHIP CHECK
  const getCurrentUserId = () => {
    // 1. Cek localStorage userId langsung
    const localStorageUserId = localStorage.getItem("userId");
    if (localStorageUserId) return localStorageUserId;
    
    // 2. Cek dari user object
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const userIdFromObject = user._id || user.id;
        
        if (userIdFromObject) {
          // Auto-save ke localStorage untuk next time
          localStorage.setItem("userId", userIdFromObject);
          return userIdFromObject;
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    return null;
  };

  const currentUserId = getCurrentUserId();
  const isOwner = post && post.author && post.author._id === currentUserId;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus postingan "${post.title}"?`);
    if (!confirmDelete) return;

    setDeleteLoading(true);

    try {
      await postService.deletePost(id);
      alert("🎉 Postingan berhasil dihapus!");
      navigate("/");
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ Gagal menghapus postingan");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading post...</div>;
  }

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Post tidak ditemukan</p>
        <Link to="/">Kembali ke Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: "25px" }}>
        <Link to="/" style={{ color: "#666", textDecoration: "none", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "5px", padding: "8px 16px", border: "1px solid #ddd", borderRadius: "6px" }}>
          ← Kembali ke Home
        </Link>
      </div>

      {/* GAMBAR */}
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px", marginBottom: "25px" }} />
      )}

      {/* JUDUL */}
      <h1 style={{ fontSize: "32px", marginBottom: "15px", color: "#333", lineHeight: "1.3", fontWeight: "700" }}>
        {post.title}
      </h1>

      {/* AUTHOR & TANGGAL */}
      <div style={{ color: "#666", marginBottom: "25px", fontSize: "14px", paddingBottom: "15px", borderBottom: "1px solid #eee" }}>
        <span><strong>By:</strong> {post.author?.name || "Unknown"}</span>
        <span style={{ margin: "0 10px" }}>•</span>
        <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* KONTEN */}
      <div style={{ lineHeight: "1.8", fontSize: "16px", color: "#444", whiteSpace: "pre-line", minHeight: "200px" }}>
        {post.content}
      </div>

      {/* TOMBOL EDIT/DELETE */}
      {isOwner && (
        <div style={{ marginTop: "40px", display: "flex", gap: "15px", paddingTop: "25px", borderTop: "1px solid #eee" }}>
          <Link
            to={`/edit/${post._id}`}
            style={{
              padding: "12px 24px",
              background: "#007bff",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ✏️ Edit Post
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            style={{
              padding: "12px 24px",
              background: deleteLoading ? "#6c757d" : "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: deleteLoading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {deleteLoading ? "🔄 Menghapus..." : "🗑️ Hapus Post"}
          </button>
        </div>
      )}

      {/* INFO UNTUK NON-OWNER YANG LOGIN */}
      {!isOwner && currentUserId && (
        <div style={{ 
          marginTop: "30px", 
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "6px",
          textAlign: "center",
          color: "#666",
          fontSize: "14px"
        }}>
          ℹ️ Anda hanya dapat mengedit atau menghapus postingan Anda sendiri
        </div>
      )}

      {/* INFO UNTUK GUEST */}
      {!currentUserId && (
        <div style={{ 
          marginTop: "30px", 
          padding: "15px",
          background: "#e7f3ff",
          borderRadius: "6px",
          textAlign: "center",
          color: "#0066cc",
          fontSize: "14px"
        }}>
          🔐 <Link to="/login" style={{ color: "#0066cc", fontWeight: "600" }}>Login</Link> untuk membuat postingan Anda sendiri
        </div>
      )}
    </div>
  );
};

export default PostDetail;