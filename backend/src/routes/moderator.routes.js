import express from 'express'

import { protect } from '../middlewares/auth.middleware.js'
import isModerator from '../middlewares/moderator.middleware.js'
import isAdmin from '../middlewares/admin.middleware.js'
import { flagPost, hidePost, escalatePost, deletePost, deleteComment, getModActions } from '../controllers/moderator.controller.js'

const router = express.Router()

router.patch('/posts/:postID/flag', protect, isModerator, flagPost);
router.patch("/posts/:postID/hide", protect, isModerator, hidePost);
router.patch("/posts/:postID/escalate", protect, isModerator, escalatePost);
router.delete("/posts/:postID", protect, isModerator, deletePost);
router.delete("/posts/:postID/comments/:commentID", protect, isModerator, deleteComment);
router.get("/actions", protect, isAdmin, getModActions);

export default router;