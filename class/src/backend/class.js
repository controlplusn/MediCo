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

  //adding class
  app.post('/classes', async (req, res) => {
    try {
      const { title, host } = req.body;
  
      // Validate input
      if (!title || !host) {
        return res.status(400).json({ message: 'Title and host are required.' });
      }
  
      // Create a new class
      const newClass = new Class({
        title,
        host,
      });
  
      // Save the class to the database
      const savedClass = await newClass.save();
  
      // Respond with the newly created class
      res.status(201).json(savedClass);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });

  //deleting class

  app.delete('/classes/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the class exists
      const existingClass = await Class.findById(id);
      if (!existingClass) {
        return res.status(404).json({ message: 'Class not found.' });
      }
  
      // Delete the class
      await Class.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Class deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });

  app.put('/classes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
  
      // Validate input
      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Class title is required.' });
      }
  
      // Check if the class exists
      const existingClass = await Class.findById(id);
      if (!existingClass) {
        return res.status(404).json({ message: 'Class not found.' });
      }
  
      // Update the class name
      existingClass.title = title.trim();
      await existingClass.save();
  
      res.status(200).json({ message: 'Class updated successfully.', updatedClass: existingClass });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
