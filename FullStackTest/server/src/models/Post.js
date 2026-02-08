const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", content: "text", category: "text" });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
