import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

const getAllPosts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getPostById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const createPost = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res; // ✅ KEMBALIKAN res, BUKAN res.data
};

// services/postService.js
const updatePost = async (id, data) => {
  const token = localStorage.getItem("token");
  
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  // ✅ DETECT JIKA DATA ADALAH FormData ATAU JSON
  if (data instanceof FormData) {
    console.log("📤 Sending as FormData");
    // Biarkan browser set Content-Type untuk FormData
  } else {
    console.log("📤 Sending as JSON");
    config.headers['Content-Type'] = 'application/json';
    
    // Convert to JSON string jika object
    if (typeof data === 'object' && !(data instanceof FormData)) {
      data = JSON.stringify(data);
    }
  }
  
  const res = await axios.put(`${API_URL}/${id}`, data, config);
  return res;
};

const deletePost = async (id) => {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};