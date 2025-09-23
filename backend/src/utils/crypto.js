import crypto from 'crypto';

const algo = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

if(!key || key.length !== 32) {
    throw new Error("Invalid encryption key. Ensure ENCRYPTION_KEY is set and is 32 bytes long.");
};

export function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(algo, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString("hex")}:${tag}:${encrypted}`;
};

export function decrypt(payload) {
    const [ivHex, tagHex, encrypted] = payload.split(":");
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(algo, Buffer.from(key), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};