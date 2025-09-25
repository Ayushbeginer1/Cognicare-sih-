import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    answer: {type: Number, required: true},
}, { _id: false });

const botReplySchema = new mongoose.Schema({
    source: { type: String},
    severity: { type: String},
    suggestion: [String],
    raw: {type: String},
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['PHQ-9', 'GAD-7', 'GHQ'], required: true },
    answers: [answerSchema],
    score: { type: Number },
    interpretation: { type: String },
    botReply: botReplySchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Assessment = mongoose.model('Assessment', assessmentSchema);
