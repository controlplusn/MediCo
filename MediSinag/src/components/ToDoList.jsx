import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/tdlist.css';

const ToDoList = ({ userId }) => {
  const [tasks, setTasks] = useState([]); // State to hold the tasks

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/todos/${userId}`);
        const sortedTasks = sortTasks(response.data.ToDo);
        setTasks(sortedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Function to sort tasks
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      return a.done === b.done ? 0 : a.done ? 1 : -1; // Sort 'done' tasks to the bottom
    });
  };

  const handleCheckboxChange = async (e, taskItem) => {
    const updatedDoneStatus = e.target.checked;
    console.log(`Updating task "${taskItem.task}" for user ${userId} to done: ${updatedDoneStatus}`);

    try {
      await axios.put('http://localhost:5000/todos/update', {
        userId: userId,
        taskValue: taskItem.task,
        done: updatedDoneStatus
      });

      // Optimistically update the task in the frontend state
      const updatedTasks = tasks.map(t =>
        t.task === taskItem.task ? { ...t, done: updatedDoneStatus } : t
      );

      // Sort the updated tasks
      setTasks(sortTasks(updatedTasks));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (taskItem) => {
    console.log(`Deleting task "${taskItem.task}" for user ${userId}`);

    try {
      await axios.delete(`http://localhost:5000/todos/delete`, {
        data: {
          userId: userId,
          taskValue: taskItem.task,
        },
      });

      // Remove the task from the local state
      setTasks(prevTasks => prevTasks.filter(t => t.task !== taskItem.task));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="tdlist--header">
      <h5>To Do List</h5>
      <div className="tdl">
        <div className="list--container">
          {tasks.length > 0 ? tasks.map((taskItem) => (
            <label key={taskItem._id}>
            
              <input
                type="checkbox"
                checked={taskItem.done}
                onChange={(e) => handleCheckboxChange(e, taskItem)} // Pass the entire taskItem
              />
              <h5 className={taskItem.done ? 'checked' : ''}>
                {taskItem.task}
              </h5>
              <button className={'delete'} onClick={() => handleDelete(taskItem)}>#</button>
            </label>
          )) : <p>No tasks available.</p>}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;