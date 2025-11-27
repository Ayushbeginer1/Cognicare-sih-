import dummyBotResponder from "../utils/dummy.bot.js";
import { Assessment } from "../models/assessment.model.js";
import { scoreAssessment } from "../utils/assessments.js";

const BOT_APT_URL = process.env.PSYCHOCARE_SERVICE_URL;
const BOT_APT_API_KEY = process.env.PSYCHOCARE_SERVICE_SECRET;

// POST /api/psychocare/webhook/bot-reply
async function receiveBotReply(req, res) {
    try {
        const incomingSecret = req.headers['x-service-secret'];
        if(!BOT_APT_API_KEY || incomingSecret !== BOT_APT_API_KEY) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { assessmentId, source, severity, suggestions, raw } = req.body;
        if (!assessmentId) return res.status(400).json({ message: 'Missing assessmentId' });
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
        assessment.botReplies.push({
            source,
            severity,
            suggestions,
            raw
        });
        await assessment.save();
        return res.json({ message: 'Bot reply recorded' });
    } catch (error) {
        console.error("Error recording bot reply:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// POST /api/psychocare/assess
async function submitAssessment(req, res) {
    try {
        const { type, answers } = req.body;
        const user = req.user;
        if (!type || !answers) return res.status(400).json({ message: 'Missing type or answers' });
        const { score, interpretation } = scoreAssessment(type, answers);
        const { severity, suggestions } = dummyBotResponder(type, score);
        const assessment = await Assessment.create({
            user: user._id,
            type,
            answers,
            score,
            interpretation,
            botReplies: [
                {
                    source: 'dummy-bot',
                    severity,
                    suggestions,
                    raw: {score, interpretation}
                }
            ]
        });

        // forward to Python service (if configured)
        // let botResponse = null;
        // if (PSY_URL) {
        //     try {
        //         const forwardResp = await fetch(`${PSY_URL}/api/bot/process`, {
        //             method: 'POST',
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "x-service-secret": BOT_APT_API_KEY
        //             },
        //             body: JSON.stringify({
        //                 assessmentId: assessment._id,
        //                 userId: userser._id,
        //                 type,
        //                 score,
        //                 interpretation
        //             })
        //         });
        //         botResponse = await forwardResp.json();
        //         if (botResponse) {
        //             assessment.botReplies.push({
        //                 source: botResponse.source,
        //                 severity: botResponse.severity,
        //                 suggestions: botResponse.suggestions || [],
        //                 raw: botResponse
        //             });
        //             await assessment.save();
        //         }
        //     } catch (error) {
        //         console.error("Error communicating with PsychoCare service:", error);
        //     }
        // }
        // return res.status(201).json({ assessment, botResponse });
        return res.status(201).json({ 
            message: 'Assessment submitted successfully',
            assessment 
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// GET /api/psychocare/my
async function getMyAssessments(req, res) {
    try {
        const assessments = await Assessment.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.json({ assessments });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// GET /api/psychocare/:id (admin or owner)
async function getAssessmentById(req, res) {
    try {
        const assessment = await Assessment.findById(req.params.id).populate('user', 'name email isAdmin');
        if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

        // Check if the user is admin or the owner of the assessment
        if (!req.user.isAdmin && !assessment.user._id.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not Authorized' });
        }
        return res.json({ assessment });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export { receiveBotReply, submitAssessment, getMyAssessments, getAssessmentById };