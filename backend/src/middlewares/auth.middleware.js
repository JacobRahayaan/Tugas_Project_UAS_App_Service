const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  let token;

  // Cek apakah ada header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ambil token tanpa kata "Bearer"
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari database (tanpa password)
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau sudah kadaluarsa",
      });
    }
  }

  // Jika tidak ada token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Tidak ada token, akses ditolak",
    });
  }
};

module.exports = authMiddleware;
