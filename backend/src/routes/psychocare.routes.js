import express from 'express';

import { submitAssessment, getMyAssessments, getAssessmentById, receiveBotReply } from '../controllers/psychocare.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js';

const router = express.Router();

router.post('/assess', protect, submitAssessment);
router.get('/my', protect, getMyAssessments);
router.get('/:id', protect, isAdmin, getAssessmentById);
router.post('/webhook/bot-reply', receiveBotReply); // Public endpoint for bot replies

export default router;
