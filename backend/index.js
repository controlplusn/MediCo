import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
    connectDB();
    console.log("Server running");
});