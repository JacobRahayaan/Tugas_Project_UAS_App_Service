const Post = require("../models/post.model");

// =========================
// CREATE POST
// =========================
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      imageUrl: req.file ? req.file.path : null,
    });

    res.status(201).json({
      success: true,
      message: "Post berhasil dibuat",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

// =========================
// GET ALL POSTS + PAGINATION
// =========================
exports.getPosts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      current_page: page,
      total_pages: Math.ceil(totalPosts / limit),
      total_posts: totalPosts,
      count: posts.length,
      data: posts,
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
// GET POST BY ID
// =========================
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
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
// UPDATE POST
// =========================
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post tidak ditemukan",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Tidak punya izin untuk mengedit post ini",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post berhasil diperbarui",
      data: post,
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
// DELETE POST
// =========================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post tidak ditemukan",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Tidak punya izin untuk menghapus post ini",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};
