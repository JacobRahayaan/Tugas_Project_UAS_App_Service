import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

// Register function
const register = async (name, email, password) => {
  const res = await axios.post(API_URL + "register", {
    name,
    email,
    password,
  });

  // Simpan token DAN user data ke localStorage
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  if (res.data.data) {
    localStorage.setItem("user", JSON.stringify(res.data.data));
  }

  return res.data;
};

// Login function  
const login = async (email, password) => {
  const res = await axios.post(API_URL + "login", {
    email,
    password,
  });

  console.log("✅ Response login:", res.data);

  // Simpan token DAN user data ke localStorage
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    console.log("🔑 Token disimpan");
  }
  
  if (res.data.data) {
    localStorage.setItem("user", JSON.stringify(res.data.data));
    console.log("👤 Data user disimpan:", res.data.data);
  } else {
    console.warn("⚠️ Tidak ada data user dalam response");
  }

  return res.data;
};

const authService = {
  register,
  login,
};

export default authService;