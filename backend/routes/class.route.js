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

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'User id required'
            });
        }

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
                  likes: Array.isArray(discussion.likes) ? discussion.likes : [], // Ensure likes is always an array
                  likesCount: Array.isArray(discussion.likes) ? discussion.likes.length : 0,
                  comments: discussion.comments,
                  commentsCount: discussion.comments.length
              }))
            };
        });

        console.log('Processed classes:', JSON.stringify(processedClasses, null, 2));

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

        const userId = req.userId;
        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'User id required'
            });
        }

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
                likes: discussion.likes,
                likesCount: discussion.likes.length,
                isLikedByUser: discussion.likes.includes(username),
                comments: discussion.comments.map(comment => ({
                  _id: comment._id,
                  author: comment.author,
                  content: comment.content,
                  time: comment.time
              }))
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

// Add a comment to a specific disccusion
router.post('/addComment/:classId/:DiscussionId', verifyToken, async (req, res) => {
    const { classId, DiscussionId } = req.params;
    const { commentContent, author } = req.body;
  
    try {
      // Validate input
      if (!commentContent || !author) {
        return res.status(400).json({ message: 'Comment content and author are required' });
      }
  
      // Validate class ID and discussion ID
      if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(DiscussionId)) {
        return res.status(400).json({ message: 'Invalid class or discussion ID' });
      }
  
      // Find the class by ID
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Find the specific discussion by its id
      const discussion = classData.discussion.id(DiscussionId);
      if (!discussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
  
      // Create a new comment
      const newComment = {
        content: commentContent,
        author,
        time: new Date(), // Add timestamp
        _id: new mongoose.Types.ObjectId(), // Ensure unique ID
      };
  
      // Push the new comment to the comments array of the selected discussion
      discussion.comments.push(newComment);
  
      // Save the updated class document
      await classData.save();
  
      res.status(201).json({
        message: 'Comment added successfully',
        comment: newComment,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add discussion
router.post('/addDiscussion/:classId', verifyToken, async (req, res) => {
    const { classId } = req.params;
    const { title, author, content } = req.body;
  
    try {
      // Validate input
      if (!title || !author || !content) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Validate class ID
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
  
      // Find the class by ID
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Create a new discussion
      const newDiscussion = {
        title,
        author,
        content,
        date: new Date(),
        likes: [],
        comments: [],
        _id: new mongoose.Types.ObjectId(), // Generate a unique ID for the discussion
      };
  
      // Add the discussion to the class
      classData.discussion.push(newDiscussion);
  
      // Save the updated class document
      await classData.save();
  
      res.status(201).json({
        message: 'Discussion added successfully',
        discussion: newDiscussion,
      });
    } catch (error) {
      console.error('Error adding discussion:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
  

// Add a like to a specific discussion
router.post('/likeDiscussion/:classId/:DiscussionId/:username', verifyToken, async (req, res) => {
    const { classId, DiscussionId, username } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(DiscussionId)) {
        return res.status(400).json({ message: 'Invalid class or discussion ID' });
      }
  
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      const discussion = classData.discussion.id(DiscussionId);
      if (!discussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
  
      if (discussion.likes.includes(username)) {
        return res.status(400).json({ message: 'You have already liked this discussion' });
      }

      if (!discussion.likes.includes(username)) {
        discussion.likes.push(username);
        await classData.save();
  
        res.status(200).json({
          message: 'Discussion liked successfully',
          likes: discussion.likes,
          likesCount: discussion.likes.length,
        });
      } else {
        res.status(400).json({ message: 'You have already liked this discussion' });
      }
    } catch (error) {
      console.error('Error liking discussion:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Remove a like from a specific discussion
router.delete('/unlikeDiscussion/:classId/:DiscussionId/:username', verifyToken, async (req, res) => {
    const { classId, DiscussionId, username } = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(DiscussionId)) {
        return res.status(400).json({ message: 'Invalid class or discussion ID' });
      }
  
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      const discussion = classData.discussion.id(DiscussionId);
      if (!discussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }
  
      discussion.likes = discussion.likes.filter(user => user !== username);
      await classData.save();

      discussion.likes = discussion.likes.filter(user => user !== username);
      await classData.save();


      res.status(200).json({
        message: 'Like removed successfully',
        likes: discussion.likes,
        likesCount: discussion.likes.length,
      });
    } catch (error) {
      console.error('Error unliking discussion:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});



export default router;