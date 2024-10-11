import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// authentication route 
app.use("/api/auth", authRoutes)


// run the server
app.listen(PORT, () => {
    connectDB();
    console.log("Server is running");
});
