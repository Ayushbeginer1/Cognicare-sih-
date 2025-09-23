import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: function () { return !this.isAnonymous; } },
    pseudonym: { type: String, },
    isAnonymous: { type: Boolean, default: false },
    encryptedContact: { type: string},
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    appointmentDate: { type: Date, required: true },
    status: { type: String, enum: ['scheduled','confirmed', 'completed', 'canceled'], default: 'scheduled' },
    notes: { type: String, }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;