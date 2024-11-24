import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import todosRoutes from './routes/todos.route.js';
import studyListRoutes from './routes/studyList.route.js';
import communityRoutes from './routes/community.routes.js';
import cardRoutes from './routes/cards.route.js';
import flearn from './routes/flashcardReview.route.js';
import classRoutes from './routes/class.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // Parse incoming requests:req.body
app.use(cookieParser()); // Parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/todos", todosRoutes);
app.use("/api/studylists", studyListRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/flashcard", cardRoutes);
app.use("/api/cardlearn", flearn);
app.use("/api/class", classRoutes);

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log("Server running");
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
});