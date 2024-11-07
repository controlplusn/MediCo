import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://admin:7yWeidM9K8LDzNWY@cluster0.jxxoj.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

const todoSchema = new mongoose.Schema({
  isChecked: Boolean,
  task: String
});


const ToDo = mongoose.model('ToDo', todoSchema);

app.get('/todos', async (req, res) => {
  try {
      // Fetch documents from the collection
      const documents = await mongoose.connection.collection('testauths').find({}, { projection: { _id: 0, ToDo: 1 } }).toArray();
      
      console.log('Fetched documents:', documents); // Log fetched documents to check structure
      
      // Check if documents are returned and filter out empty 'ToDo' arrays
      const todos = documents
          .map(doc => doc.ToDo)
          .filter(todo => Array.isArray(todo) && todo.length > 0); // Ensure ToDo is an array and has content
      
      console.log('Filtered ToDo arrays:', todos); // Log filtered ToDo arrays

      // If no valid ToDo arrays are found, send a 404 error
      if (todos.length === 0) {
          return res.status(404).json({ message: 'No ToDo documents found' });
      }

      // Send the first valid ToDo array
      res.json(todos[0]);
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch ToDos', error: err.message });
  }
});

  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
