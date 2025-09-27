import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import ModAction from "../models/moderatorAction.model.js";
import { notFound, errorHandler } from "../middlewares/error.handler.js";

// Flag a post (visible but marked)
async function flagPost(req, res, next) {
    try {
        const { postID } = req.params
        const post = await Post.findById(postID)
        if (!post) return next(notFound(req, res, next));
        const postStatus = await post.status('flagged')
        await ModAction.create({
            moderator: req.user._id,
            post: post._id,
            action: 'flagged',
            reason: req.body.reason,
        })
        res.status(200).json({ message: "Post flagged", post, postStatus })
    } catch (error) {
        next(error)
    }
};

// Hide a post (invisible from user queries)
async function hidePost(req, res, next) {
    try {
        const { postID } = req.params
        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));
        const postStatus = await post.status('hidden');
        await ModAction.create({
            moderator: req.user._id,
            post: post._id,
            action: 'hidden',
            reason: req.body.reason,
        })
        res.status(200).json({ message: "Post Hidden", post, postStatus })
    } catch (error) {
        next(error)
    }
};

// Escalate a post (forward to admin/psychocare)
async function escalatePost(req, res, next) {
    try {
        const { postID } = req.params;
        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));
        const postStatus = await post.status('flagged');
        await ModAction.create({
            moderator: req.user._id,
            post: post._id,
            action: 'escalated',
            reason: req.body.reason,
        })
        res.status(200).json({
            message: "Post escalated for urgent attention",
            post,
            postStatus,
            userToContact: post.user,
        });
    } catch (error) {
        next(error)
    }
};

// Delete a post
async function deletePost(req, res, next) {
    try {
        const { postID } = req.params;
        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));
        const deletePost = await Post.findByIdAndDelete(postID);
        await Comment.deleteMany({ post: postID });
        await ModAction.create({
            moderator: req.user._id,
            post: post._id,
            action: 'deleted',
            reason: req.body.reason,
        })
        res.status(200).json({ message: "Post deleted successfully", deletePost });
    } catch (error) {
        next(error);
    }
}

// Delete a comment
async function deleteComment(req, res, next) {
    try {
        const {postID, commentID} = req.params;
        const post = await Post.findById(postID);
        if (!post) return next(notFound(req, res, next));
        const comment = await Comment.findById(commentID);
        if (!comment) return next(notFound(req, res, next));
        const deleteComment = await Comment.findByIdAndDelete(commentID);
        await ModAction.create({
            moderator: req.user._id,
            post: post._id,
            action: 'deleted',
            reason: req.body.reason,
        })
        res.status(200).json({ message: "Comment deleted successfully", deleteComment });
    } catch (error) {
        next(error);
    }
}

async function getModActions(req, res, next) {
    try {
        const actions = await ModAction.find().populate('moderator', 'name email').populate('post', 'content status').sort({ createdAt: -1 });
        res.status(200).json({ actions });
    } catch (error) {
        next(error);
    }
}

export { flagPost, hidePost, escalatePost, deletePost, deleteComment, getModActions }