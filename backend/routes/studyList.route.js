import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/verifyToken.js';
import studList from "../model/studylist.js";

const router = express.Router();

router.get("/studylist", verifyToken, async (req, res) => {
    try {
        const userId = req.userId  // get userId token

        const data = await studList.find({ userId });

        if (!data.length) {
            return res.status(404).json({ success: false, message: "No data found for this user" });
        }

        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log('Error displaying data:', error);
        res.status(400).send({ success: false, message: "Error displaying data" });
    }
});

router.post("/add", verifyToken, async (req,res) => {
    const { date, subject, type, FlashCard } = req.body;

    if (!date ||  !subject || !type || !FlashCard) {
        return res.status(400).json({
            success: false,
            message: "All fields are required to create a study list."
        });
    }

    try {
        const userId = req.userId;
        console.log('Successed in retrieving user id:', userId);

        // Create new study list 
        const newStudy = new studList({
            date,
            subject,
            type,
            FlashCard,
            userId  
        });

        const saveStudy = await newStudy.save();

        if (!saveStudy) {
            console.log("Error saving study");
            return res.status(500).json({
                success: false,
                message: "Error saving study data"
            });
        }

        res.status(201).json({ success: true, data: saveStudy });
    } catch (error) {
        console.log('Error saving study data:', error);
        res.status(500).json({ success: false, message: 'Error saving data' });
    }
});

router.put("/update", verifyToken, async (req, res) => {
    const { date, progress, status, subject, type, FlashCard } = req.body;
    const userId = req.userId;  // Extract userId from JWT token
    const { id } = req.params;  // Get the study list entry ID from the request URL

    try {
        // Find the study list entry by ID and ensure it belongs to the current user
        const studyItem = await studList.findOne({ _id: id, userId });

        if (!studyItem) {
            return res.status(404).json({ success: false, message: "Study item not found or unauthorized" });
        }

        // Update the fields
        studyItem.date = date || studyItem.date;  // Update date if provided, otherwise keep the old value
        studyItem.subject = subject || studyItem.subject;
        studyItem.type = type || studyItem.type;
        studyItem.FlashCard = FlashCard || studyItem.FlashCard;

        // Save the updated study item to the database
        const updatedStudyItem = await studyItem.save();

        // Respond with the updated data
        res.status(200).json({ success: true, data: updatedStudyItem });

    } catch (error) {
        console.error("Error updating study item:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
    
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }


        const studyItem = await studList.findById(id);
        if (!studyItem) {
            return res.status(404).json({ success: false, message: "Study item not found" });
        }

        // if loggeed in user is the same as the user who created the study item
        if (studyItem.userId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this item" });
        }

        // delete the study item
        await studyItem.deleteOne({ _id: id });

        res.status(200).json({ success: true, message: "Study item deleted successfully" });

    } catch (error) {
        console.error('Error deleting study item:', error);
        res.status(500).json({ success: false, message: "Server error while deleting study item" });
    }
});





export default router;