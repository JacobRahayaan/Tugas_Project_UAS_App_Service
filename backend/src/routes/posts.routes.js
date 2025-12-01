const express = require("express");
const router = express.Router();

const postController = require("../controllers/posts.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// GET semua post (public)
router.get("/", postController.getPosts);

// GET post by ID (public)
router.get("/:id", postController.getPostById);

// Private routes
// CREATE POST (with image)
// POST http://localhost:5000/api/posts
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);

// UPDATE post (private)
// PUT http://localhost:5000/api/posts/:id
router.put("/:id", authMiddleware, postController.updatePost);

// DELETE post (private)
// DELETE http://localhost:5000/api/posts/:id
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
