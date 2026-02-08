const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { requirePostOwner, requireCommentOwner } = require("../middleware/ownership");
const { upload } = require("../middleware/upload");
const {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postsController");
const {
  listCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");

const router = express.Router();

router.get("/", asyncHandler(listPosts));
router.get("/:id", asyncHandler(getPost));
router.post("/", requireAuth, upload.single("image"), asyncHandler(createPost));
router.put("/:id", requireAuth, asyncHandler(requirePostOwner), upload.single("image"), asyncHandler(updatePost));
router.delete("/:id", requireAuth, asyncHandler(requirePostOwner), asyncHandler(deletePost));

router.get("/:id/comments", asyncHandler(listCommentsByPost));
router.post("/:id/comments", requireAuth, asyncHandler(createComment));
router.put(
  "/:id/comments/:commentId",
  requireAuth,
  asyncHandler(requireCommentOwner),
  asyncHandler(updateComment)
);
router.delete(
  "/:id/comments/:commentId",
  requireAuth,
  asyncHandler(requireCommentOwner),
  asyncHandler(deleteComment)
);

module.exports = { postsRoutes: router };
