const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relasi ke User
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
