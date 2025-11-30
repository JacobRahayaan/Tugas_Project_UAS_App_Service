import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postService from "../services/postService";
import "../assets/HomePage.css";

const HomePage = ({ isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
    checkUser();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await postService.getAllPosts();
      setPosts(res.data);
    } catch (err) {
      console.log("Gagal memuat posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // ✅ AMBIL DATA USER DARI LOCALSTORAGE
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUser({
            name: user.name || "User",
            email: user.email || ""
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Fallback ke default
          setUser({
            name: "User",
            email: ""
          });
        }
      } else {
        // Fallback jika tidak ada data user
        setUser({
          name: "User", 
          email: ""
        });
      }
    }
  };

  // ✅ HANDLE CARD CLICK untuk navigasi ke detail post
  const handleCardClick = (e, postId) => {
    e.preventDefault();
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="hero-title">Home Page✨</h1>
        <p className="hero-subtitle">
          Soft. Clean. Aesthetic. Enjoy reading my curated stories.
        </p>
      </section>

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2 className="dashboard-title">Daftar Postingan</h2>
          
          {user && (
            <span className="user-greeting">
              👋 Halo, {user.name}
            </span>
          )}
        </div>
      </div>

      {/* JIKA BELUM ADA POST */}
      {posts.length === 0 && (
        <div className="empty-state">
          <p className="empty-text">Belum ada postingan.</p>
          {isLoggedIn && (
            <Link to="/create" className="btn-create-empty">
              Buat Post Pertama
            </Link>
          )}
        </div>
      )}

      {/* GRID POSTS */}
      {posts.length > 0 && (
        <div className="post-grid">
          {posts.map((post) => (
            <div
              key={post._id || post.id}
              onClick={(e) => handleCardClick(e, post._id || post.id)}
              className="post-card"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="gambar post"
                  className="post-image"
                />
              )}

              <h3 className="post-title">{post.title}</h3>

              <p className="post-content">
                {post.content.substring(0, 80)}...
              </p>

              <div className="post-meta">
                <small className="post-author">
                  By: {post.author?.name || "Unknown"}
                </small>
              </div>

              {/* HANYA TOMBOL BACA SELENGKAPNYA */}
              <div className="read-more-container">
                <Link 
                  to={`/post/${post._id || post.id}`} 
                  className="read-more-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;