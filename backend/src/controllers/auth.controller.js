const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // token berlaku 1 hari
  });
};

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // cek apakah email sudah dipakai
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    // buat user baru
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    // cek password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password salah",
      });
    }

    // jika sukses → kirim token
    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      token: generateToken(user._id),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};
