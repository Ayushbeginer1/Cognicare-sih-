import crypto from "crypto";

const keyHex = process.env.ENCRYPTION_KEY;
if (!keyHex) {
  throw new Error("ENCRYPTION_KEY is not set in .env");
}

// Convert hex string (64 chars = 32 bytes) to a Buffer
const key = Buffer.from(keyHex, "hex");

if (key.length !== 32) {
  throw new Error("Invalid encryption key. Ensure ENCRYPTION_KEY is 32 bytes long.");
}

// Example encryption function
export function encrypt(text) {
  const iv = crypto.randomBytes(16); // 16-byte IV for AES
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Example decryption function
export function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
