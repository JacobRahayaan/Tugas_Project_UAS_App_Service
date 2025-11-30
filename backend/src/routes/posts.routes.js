const express = require("express");
const router = express.Router();

const postController = require("../controllers/posts.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

// GET semua post (public)
router.get("/", postController.getPosts);

// GET post by ID (public)
router.get("/:id", postController.getPostById);

// CREATE POST (with image)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);

// UPDATE post (private)
router.put("/:id", authMiddleware, postController.updatePost);

// DELETE post (private)
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
