import express from "express";
import mongoose from "mongoose";
import ToDoModel from "./models/todoModel.js";
import cors from "cors";


const app = express();
app.use(cors());

// MongoDB connection string
const uri = 'mongodb+srv://admin:adminuser123@cluster0.4408g.mongodb.net/MediCo?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


  app.use(express.json()); 


// Create a GET route to fetch todos
app.get('/todos/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      // Ensure userId is a valid 24-character hex string
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
      }
  
      // Convert userId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
      
      // Find the ToDo document by userId
      const todos = await ToDoModel.findOne({ userId: userObjectId });
      
      if (!todos) {
        return res.status(404).json({ error: 'No tasks found for this user' });
      }
  
      res.status(200).json(todos);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  });
  

  app.post('/todos', async (req, res) => {
    const { ToDo, userId } = req.body;
    
    try {
      const newToDo = new ToDoModel({
        ToDo,
        userId
      });
  
      const savedToDo = await newToDo.save();
      res.status(201).json(savedToDo);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create ToDo' });
    }
  });

  app.put('/todos/update', async (req, res) => {
    const { userId, taskValue, done } = req.body;
  
    try {
      // Update the task in the database based on userId and task value
      const result = await ToDoModel.updateOne(
        { userId: userId, "ToDo.task": taskValue }, // Match both userId and task value
        { $set: { "ToDo.$.done": done } }           // Update the 'done' field of that task
      );
  
      if (result.nModified === 0) {
        return res.status(404).json({ message: 'Task not found or no changes made' });
      }
  
      res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(500).json({ message: 'Server error while updating task' });
    }
  });   
  
  app.delete('/todos/delete', async (req, res) => {
    const { userId, taskValue } = req.body;

    try {
        // Ensure userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid userId format' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Delete the task from the database
        const result = await ToDoModel.updateOne(
            { userId: userObjectId, "ToDo.task": taskValue },
            { $pull: { ToDo: { task: taskValue } } } // Use $pull to remove the task from the array
        );

        if (result.nModified === 0) {
            return res.status(404).json({ message: 'Task not found or no changes made' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});
  

// Start the Express server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
