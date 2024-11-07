import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.log("Error connection to MongoDB: " + err.message);
        process.exit(1);
    }
}