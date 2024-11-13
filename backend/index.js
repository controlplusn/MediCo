import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Parse incoming requests:req.body
app.use(cookieParser()); // Parse incoming cookies
app.use(cors());

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
    connectDB();
    console.log("Server running");
});