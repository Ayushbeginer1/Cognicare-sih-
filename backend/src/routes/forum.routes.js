import express from "express";

import { createPost, getAllPosts, getPostById, addComment, deleteComment, deletePost } from "../controllers/forum.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create/posts", protect, createPost);
router.get("/my/posts", protect, getAllPosts);
router.get("/my/posts/:id", protect, getPostById);
router.post("/create/posts/:postID/comments", protect, addComment);
router.delete("/my/posts/:postID", protect, deletePost);
router.delete("/my/posts/:postID/comments/:commentID", protect, deleteComment);

export default router;
