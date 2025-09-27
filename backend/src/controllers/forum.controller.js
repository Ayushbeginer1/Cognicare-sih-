import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { errorHandler, notFound } from "../middlewares/error.handler.js";
import isAdmin from "../middlewares/admin.middleware.js";

// Create a new post
async function createPost(req, res, next) {
    try {
        const post = await Post.create({
            user: req.user._id,
            title: req.body.title,
            content: req.body.content,
        });
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        next(error);
    }
};

// Get all active posts with user info
async function getAllPosts(req, res, next) {
    try {
        const posts = await Post.find({ status: 'active' }).populate('user', 'name, email').sort({ createdAt: -1 });
        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
};

// Get a single post by ID with comments
async function getPostById(req, res, next) {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('user', 'name email');
        if (!post) return next(notFound(req, res, next));

        const comments = await Comment.find({ post: post._id }).populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ post, comments });
    } catch (error) {
        next(error);
    }
};

// Delete a post (only by post owner)
async function deletePost(req, res, next) {
    try {
        const { postID } = req.params;
        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));
        if (post.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const deletedPost = await Post.findByIdAndDelete(postID);
        await Comment.deleteMany({ post: postID });
        if (deletedPost) {
            res.status(200).json({ message: "Post deleted successfully" });
        } else {
            return next(notFound(req, res, next));
        }
    } catch (error) {
        next(error);
    }
}

// Add a comment to a post
async function addComment(req, res, next) {
    try {
        const { postID } = req.params;
        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));

        const comment = await Comment.create({
            post: post._id,
            user: req.user._id,
            content: req.body.content,
        });
        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        next(error);
    }
};

// Delete a comment (only by comment owner)
async function deleteComment(req, res, next) {
    try {
        const { postID, commentID } = req.params;

        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));

        const comment = await Comment.findById(commentID);
        if (!comment) return next(notFound(req, res, next));
        if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const deletedComment = await Comment.findByIdAndDelete(commentID);
        if (deletedComment) {
            res.status(200).json({ message: "Comment deleted successfully" });
        } else {
            return next(notFound(req, res, next));
        }
    } catch (error) {
        next(error);
    }
}

export { createPost, getAllPosts, getPostById, addComment, deleteComment, deletePost };