import Appointment from "../models/appointment.model.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import User from "../models/user.model.js";

// Create a new booking (appointment)
async function createBooking(req, res) {
    try {
        const {appointmentDate, isAnonymous = false, pseudonym, contact } = req.body;

        if (!appointmentDate) {
            return res.status(400).json({ message: "Appointment date is required" });
        }

        let bookingData = {
            appointmentDate,
            isAnonymous,
            pseudonym: isAnonymous ? pseudonym || "Anonymous" : undefined,
        };
        if (isAnonymous) {
            if (!contact) {
                return res.status(400).json({ message: "Contact information is required for anonymous bookings" });
            }
            bookingData.encryptedContact = encrypt(contact);
        } else {
            if (!req.user) {
                return res.status(401).json({ message: "Authentication required for non-anonymous bookings" });
            }
            bookingData.user = req.user._id;
            if (contact) {
                bookingData.encryptedContact = encrypt(contact);
            }
        }
        const appointment = await Appointment.create(bookingData);
        res.status(201).json({message: "Appointment created successfully", appointment});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
}

// Get bookings for the logged-in user
async function getMyBookings(req, res) {
    try {
        const bookings = await Appointment.find({ user: req.user._id}).sort({ appointmentDate: -1 });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Get bookings by ID (admin only)
async function getBookingById(req, res) {
    try {
        const booking = await Appointment.findById(req.params.id).populate('user', 'name email isAdmin');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (req.user && (req.user.isAdmin || (booking.user && booking.user._id.equals(req.user._id)))) {
            let decryptedContact = null;
            if (booking.encryptedContact) {
                decryptedContact = decrypt(booking.encryptedContact);
            }
            const response = {
                id: booking._id,
                isAnanymous: booking.isAnonymous,
                pseudonym: booking.pseudonym,
                appointmentDate: booking.appointmentDate,
                status: booking.status,
                notes: booking.notes,
                user: booking.user ? {id: booking.user._id, name: booking.user.name, email: booking.user.email} : null,
                contact: decryptedContact,
                createdAt: booking.createdAt,
            };
            return res.status(200).json(response);
        }
        return res.status(403).json({ message: "Access denied" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Get all bookings (admin only)
async function getAllBookings(req, res) {
    try {
        const bookings = await Appointment.find().populate('user', 'name email').sort({ appointmentDate: -1 });
        return res.status(200).json({ bookings });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Update booking status/assign counselor/notes (admin only)
async function updateBooking(req, res) {
    try {
        const { status, counselorId, notes } = req.body;
        const booking = await Appointment.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (status) booking.status = status;
        if (counselorId) booking.counselorId = counselorId;
        if (notes !== undefined) booking.notes = notes;
        await booking.save();
        return res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export { createBooking, getMyBookings, getBookingById, getAllBookings, updateBooking };