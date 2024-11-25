import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Class from '../model/classModel.js';
import User from '../model/User.js'; // for username
import mongoose from 'mongoose';

const router = express.Router();

// fetch current user's info
router.get('/current-user', verifyToken, async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId).select('username email');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});


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

// Adding a new class
router.post('/addClass', verifyToken, async (req, res) => {
    try {
        const { title } = req.body;
        console.log("Fetch class title:", title);

        const userId = req.userId;
        console.log("Fetch user id:", userId);

        // Fetch the username of the logged-in user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const host = user.username;

        // Validate input
        if (!title || !host) {
            return res.status(400).json({ success: false, message: 'Title and host are required.' });
        }

        // Create a new class
        const newClass = new Class({
            title,
            host,
            people: [], // Initialize with an empty array
            discussion: [] // Initialize with an empty array
        });

        // Save the class to the database
        const savedClass = await newClass.save();

        res.status(201).json({ success: true, data: savedClass });

    } catch (err) {
        console.error('Error adding class:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// Edit a class
router.put('/editClass/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.userId;

        // Find the class and check if the user is the host
        const classToUpdate = await Class.findById(id);

        console.log("User ID:", userId);
        console.log("Class to update:", classToUpdate);

        if (!classToUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Class not found or you do not have permission to edit it.'
            });
        }

        // Check if the logged in user is the host
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (classToUpdate.host !== user.username) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to edit this class.'
            });
        }

        // Update the class title
        classToUpdate.title = title;
        await classToUpdate.save();

        res.json({
            success: true,
            message: 'Class updated successfully',
            data: classToUpdate
        });
    } catch (error) {
        console.error('Error editing class:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// Delete a class
router.delete('/deleteClass/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Find the class by id
        const classToDelete = await Class.findById(id);

        if (!classToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Class not found or you do not have permission to delete it.'
            });
        }

        // Check if the logged in user is the host
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (classToDelete.host !== user.username) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this class.'
            });
        }

        // Delete the class
        await Class.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Class deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// get classes based on username and class id
router.get('/:username/:id', verifyToken, async (req, res) => {
    try {
        const { username, id } = req.params;

        console.log("Username:", username);
        console.log('Class id:', id);

        const userId = req.userId;
        console.log("User id retrieved in fetching classes based on username:", userId);

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'User id required'
            });
        }

        console.log("Fetching class for user:", username);

        // fetch class where username is either in people or is the host
        const classData = await Class.findOne({
            $or: [
                { people: username },
                { host: username }
            ],
            _id: id
        });

        if (!classData) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        // process data and calculate statistics
        const totalDiscussions = classData.discussion.length;
        const totalPeople = classData.people.length + 1; // +1 for the host

        const processedClass = {
            _id: classData._id,
            title: classData.title,
            host: classData.host,
            people: classData.people,
            statistics: {
                totalDiscussions,
                totalPeople,
            },
            discussions: classData.discussion.map(discussion => ({
                _id: discussion._id,
                title: discussion.title,
                author: discussion.author,
                date: discussion.date,
                content: discussion.content,
                likes: discussion.likes.length,
                comments: discussion.comments.length
            }))
        };

        // respond with processed data and statistics
        return res.status(200).json({
            success: true,
            data: processedClass
        });

    } catch (error) {
        console.error("Error loading class:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });    
    }
});



export default router;