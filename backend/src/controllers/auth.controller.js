import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateToken from "../utils/genrate.token.js";

async function register(req, res, next) {
	try {
		const { name, email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const newUser = await User.create({ name, email, password });
		res.status(201).json({
			message: "User registered successfully",
			user: { id: newUser._id, name: newUser.name, email: newUser.email },
			token: await generateToken(newUser._id)
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
		next(error);
	}
};

async function login(req, res, next) {
	try {
		const { email, password } = req.body;
		
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		res.status(200).json({
			message: "Login successful",
			user: { id: user._id, name: user.name, email: user.email },
			token: await generateToken(user._id)
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
		next(error);
	}
};

function getProfile(req, res) {
	try {
		if (!req.user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json({
			id: req.user._id,
			name: req.user.name,
			email: req.user.email,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
		next(error);
	}
}

export { register, login, getProfile };