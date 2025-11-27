import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    answer: {type: Number, required: true},
}, { _id: false });

const botReplySchema = new mongoose.Schema({
    source: { type: String, default: 'dummy-bot' },
    severity: { type: String},
    suggestions: [String],
    raw: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['PHQ-9', 'GAD-7', 'GHQ'], required: true },
    answers: [answerSchema],
    score: { type: Number },
    interpretation: { type: String },
    botReplies: { type: [botReplySchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Assessment = mongoose.model('Assessment', assessmentSchema);
