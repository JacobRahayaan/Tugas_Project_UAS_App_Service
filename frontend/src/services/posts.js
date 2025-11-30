import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor untuk token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getPosts = () => api.get("/posts");
export const getPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => {
  // Jika data adalah FormData (upload file), jangan set Content-Type
  const config = data instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  
  return api.post("/posts", data, config);
};
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);