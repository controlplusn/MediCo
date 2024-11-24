import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Class from '../model/classModel.js';
import mongoose from 'mongoose';

const router = express.Router();

// get classes based on username
router.get('/:username', verifyToken, async (req, res) => {
    try {
        const { username } = req.params;

    const userId = req.userId;
    console.log("User id retrieved in fetching classes based on username:", userId);

    if (!userId) {
        return res.status(404).json({
            success: false,
            message: 'User id required'
        });
    }

    console.log("Fetching classes for user:", username);

    // fetch classes where username is either in people or is the host
    const classes = await Class.find({
        $or: [
            { people : username },
            { host : username }
        ]
    });

    if (classes.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'No classes found for the provided username'
        });
    }

    // process data and calculate statistics for each class
    const processedClasses = classes.map((classItem) => {
        const totalDiscussions = classItem.discussion.length;
        const totalPeople = classItem.people.length + 1; // +1 for the host

        return {
            _id: classItem._id,
            title: classItem.title,
            host: classItem.host,
            people: classItem.people,
            statistics: {
                totalDiscussions,
                totalPeople,
            },
            discussions: classItem.discussion.map(discussion => ({
                _id: discussion._id,
                title: discussion.title,
                author: discussion.author,
                date: discussion.date,
                content: discussion.content,
                likes: discussion.likes.length,
                comments: discussion.comments.length
            }))
        };
    });

    // respond with process data and statistics
    return res.status(200).json({
        success: true,
        data: processedClasses
    });

    } catch (error) {
        console.error("Error loading classes:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });    
    }
});


export default router;