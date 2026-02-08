const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");
const { isValidObjectId } = require("../middleware/ownership");

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limitRaw = Number.parseInt(query.limit, 10);
  const limit = Math.min(50, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

async function listPosts(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const q = String(req.query.q || "").trim();

  const filter = {};
  if (q) {
    const users = await User.find({ username: { $regex: q, $options: "i" } }).select("_id");
    const userIds = users.map((u) => u._id);
    
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { author: { $in: userIds } },
    ];
  }

  const total = await Post.countDocuments(filter);
  const pages = Math.max(1, Math.ceil(total / limit));

  const items = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username avatarPath")
    .lean();

  return res.json({ items, page, limit, total, pages });
}

async function getPost(req, res) {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "Not found" });
  }
  const post = await Post.findById(id).populate("author", "username avatarPath").lean();
  if (!post) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json({ post });
}

async function createPost(req, res) {
  console.log("createPost hit");
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "").trim();
  const category = String(req.body.category || "").trim();

  if (!title || !content) {
    console.log("Validation failed: Title or Content missing");
    return res.status(400).json({ 
      message: "Field required", 
      details: { title, content, category },
      receivedBody: req.body 
    });
  }

  if (title.length < 3 || title.length > 120) {
    return res.status(400).json({ message: "Invalid title" });
  }

  if (content.length < 3) {
    return res.status(400).json({ message: "Invalid content" });
  }

  if (category && category.length > 40) {
    return res.status(400).json({ message: "Invalid category" });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : "";

  const post = await Post.create({ title, content, category, image, author: req.user.id });
  const populated = await Post.findById(post._id).populate("author", "username avatarPath").lean();
  return res.status(201).json({ post: populated });
}

async function updatePost(req, res) {
  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "").trim();
  const category = String(req.body.category || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "Field required" });
  }

  if (title.length < 3 || title.length > 120) {
    return res.status(400).json({ message: "Invalid title" });
  }

  if (content.length < 3) {
    return res.status(400).json({ message: "Invalid content" });
  }

  if (category && category.length > 40) {
    return res.status(400).json({ message: "Invalid category" });
  }

  req.post.title = title;
  req.post.content = content;
  req.post.category = category;

  if (req.file) {
    req.post.image = req.file.path && req.file.path.startsWith("http") 
      ? req.file.path 
      : `/uploads/${req.file.filename}`;
  }

  await req.post.save();

  const populated = await Post.findById(req.post._id).populate("author", "username").lean();
  return res.json({ post: populated });
}

async function deletePost(req, res) {
  await Comment.deleteMany({ post: req.post._id });
  await req.post.deleteOne();
  return res.json({ message: "OK" });
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };
