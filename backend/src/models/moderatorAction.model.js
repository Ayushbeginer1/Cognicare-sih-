import mongoose from "mongoose";

const moderatorActionSchema = new mongoose.Schema({
    moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    action: { type: String, enum: ["flagged", "hidden", "escalated", "deleted"], required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const ModAction = mongoose.model("ModeratorAction", moderatorActionSchema);
export default ModAction;