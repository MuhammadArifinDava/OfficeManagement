const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
const { isValidObjectId } = require("../middleware/ownership");

async function listCommentsByPost(req, res) {
  const postId = req.params.id;
  if (!isValidObjectId(postId)) {
    return res.status(404).json({ message: "Not found" });
  }

  const exists = await Post.exists({ _id: postId });
  if (!exists) {
    return res.status(404).json({ message: "Not found" });
  }

  const items = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate("author", "username avatarPath")
    .lean();

  return res.json({ items });
}

async function createComment(req, res) {
  const postId = req.params.id;
  if (!isValidObjectId(postId)) {
    return res.status(404).json({ message: "Not found" });
  }

  const content = String(req.body.content || "").trim();
  if (!content) {
    return res.status(400).json({ message: "Field required" });
  }

  if (content.length < 1 || content.length > 2000) {
    return res.status(400).json({ message: "Invalid content" });
  }

  const exists = await Post.exists({ _id: postId });
  if (!exists) {
    return res.status(404).json({ message: "Not found" });
  }

  const comment = await Comment.create({ content, author: req.user.id, post: postId });
  const populated = await Comment.findById(comment._id).populate("author", "username avatarPath").lean();

  return res.status(201).json({ comment: populated });
}

async function updateComment(req, res) {
  const content = String(req.body.content || "").trim();
  if (!content) {
    return res.status(400).json({ message: "Field required" });
  }

  if (content.length < 1 || content.length > 2000) {
    return res.status(400).json({ message: "Invalid content" });
  }

  req.comment.content = content;
  await req.comment.save();

  const populated = await Comment.findById(req.comment._id).populate("author", "username").lean();
  return res.json({ comment: populated });
}

async function deleteComment(req, res) {
  await req.comment.deleteOne();
  return res.json({ message: "OK" });
}

module.exports = { listCommentsByPost, createComment, updateComment, deleteComment };
