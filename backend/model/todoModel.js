import mongoose from "mongoose";

const toDoSchema = new mongoose.Schema({
  ToDo: [
    {
      task: { type: String, required: true },
      done: { type: Boolean, required: true },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const ToDoModel = mongoose.model('ToDo', toDoSchema);

export default ToDoModel;