import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Class from './model/classModel.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const uri = 'mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority';

mongoose.connect(uri)
.then(() => {
    console.log("Connected to DB")
    app.listen(PORT,() => console.log("Server is Running"))})
    .catch((err) => console.log(err));




//get classes based on username (username since it is needed for display)
app.get('/classes/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      // Fetch classes where userId is either in `people` or is the `host`
      const classes = await Class.find({
        $or: [ // I used $or in case na di nageexist sa people pero nageexist sa host
          { people: username }, // Matches if userId is in the `people` array
          { host: username } // Matches if userId is the author in any discussion
        ]
      });
  
      if (classes.length === 0) {
        return res.status(404).json({ message: 'No classes found for the provided username.' });
      }
  
      res.status(200).json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });


  //getting specific class (data is for when a class is picked)

  //get classes based on username (username since it is needed for display)
app.get('/classes/:username/:id', async (req, res) => {
  const { username, id} = req.params;

  try {
    // Fetch classes where userId is either in `people` or is the `host`
    const classes = await Class.find({
      $or: [ // I used $or in case na di nageexist sa people pero nageexist sa host
        { people: username }, // Matches if userId is in the `people` array
        { host: username } // Matches if userId is the author in any discussion
      ],
      _id:id
    });

    if (classes.length === 0) {
      return res.status(404).json({ message: 'No classes found for the provided username.' });
    }

    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


app.post('/addDiscussion/:classId', async (req, res) => {
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
      DiscussionId: new mongoose.Types.ObjectId(), // Generate a unique ID for the discussion
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



// Add a comment to a specific discussion
app.post('/addComment/:classId/:DiscussionId', async (req, res) => {
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
    const discussion = classData.discussion.find(d => d.DiscussionId.toString() === DiscussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Create a new comment
    const newComment = {
      content: commentContent,
      author,
      CommentId: new mongoose.Types.ObjectId(), // Automatically generate a new ObjectId
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

// Add a like to a specific discussion
app.post('/likeDiscussion/:classId/:DiscussionId/:username', async (req, res) => {
  const { classId, DiscussionId, username } = req.params;

  try {
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
    const discussion = classData.discussion.find(d => d.DiscussionId.toString() === DiscussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user has already liked the discussion
    if (discussion.likes.includes(username)) {
      return res.status(400).json({ message: 'You have already liked this discussion' });
    }

    // Add the username to the likes array
    discussion.likes.push(username);

    // Save the updated class document
    await classData.save();

    res.status(200).json({
      message: 'Discussion liked successfully',
      likesCount: discussion.likes.length,
    });
  } catch (error) {
    console.error('Error liking discussion:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Remove a like from a specific discussion
app.delete('/unlikeDiscussion/:classId/:DiscussionId/:username', async (req, res) => {
  const { classId, DiscussionId, username } = req.params;

  try {
    // Validate class ID and discussion ID
    if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(DiscussionId)) {
      return res.status(400).json({ message: 'Invalid class or discussion ID' });
    }

    // Find the class by ID
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find the specific discussion by its _id
    const discussion = classData.discussion.find(d => d.DiscussionId.toString() === DiscussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user has already liked the discussion
    if (!discussion.likes.includes(username)) {
      return res.status(400).json({ message: 'You have not liked this discussion yet' });
    }

    // Remove the username from the likes array
    discussion.likes = discussion.likes.filter(user => user !== username);

    // Save the updated class document
    await classData.save();

    res.status(200).json({
      message: 'Like removed successfully',
      likesCount: discussion.likes.length,
    });
  } catch (error) {
    console.error('Error unliking discussion:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
