import jwt from 'jsonwebtoken';

async function generateToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
}

export default generateToken;