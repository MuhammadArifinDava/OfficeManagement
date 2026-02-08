const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { requireCommentOwnerById } = require("../middleware/ownership");
const { updateComment, deleteComment } = require("../controllers/commentsController");

const router = express.Router();

router.put("/:id", requireAuth, asyncHandler(requireCommentOwnerById), asyncHandler(updateComment));
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(requireCommentOwnerById),
  asyncHandler(deleteComment)
);

module.exports = { commentsRoutes: router };
