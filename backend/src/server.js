import dotenv from "dotenv/config";

import app from "./app.js";
import http from "http";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});