import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../../styles/tdlist.css'
import { Icon } from '@iconify/react';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); 

  //Decode token and get User Id
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded ? decoded.userId : null;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/todos/todo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const sortedTasks = sortTasks(response.data.ToDo);
        setTasks(sortedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId, token]);

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      return a.done === b.done ? 0 : a.done ? 1 : -1; 
    });
  };

  const handleCheckboxChange = async (e, taskItem) => {
    const updatedDoneStatus = e.target.checked;
    console.log(`Updating task "${taskItem.task}" for user ${userId} to done: ${updatedDoneStatus}`);

    try {
      await axios.put('http://localhost:3001/api/todos/update', {
        taskValue: taskItem.task,
        done: updatedDoneStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const updatedTasks = tasks.map(t =>
        t.task === taskItem.task ? { ...t, done: updatedDoneStatus } : t
      );

      setTasks(sortTasks(updatedTasks));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (taskItem) => {
    console.log(`Deleting task "${taskItem.task}" for user ${userId}`);

    try {
      await axios.delete(`http://localhost:3001/api/todos/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        data: { taskValue: taskItem.task }
      });

      setTasks(tasks.filter(t => t.task !== taskItem.task));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!newTask.trim()) return; // Check if the input is empty

    try {
        console.log("Adding task for userId:", userId);
        const response = await axios.post('http://localhost:3001/api/todos/add', {
            userId: userId, 
            task: newTask, // This is where the task value is sent
            done: false // Set done to false for new tasks
        }, {
          headers: {
            Authorization: token
          }
        });

        // Add the new task to the state and sort the tasks
        const updatedTasks = [...tasks, response.data];
        setTasks(sortTasks(updatedTasks)); // Sort the tasks after adding the new one
        setNewTask(''); // Clear the input field
       
    } catch (err) {
        console.error('Error adding task:', err); // Handle any errors
    }
};

  return (
    <div className="tdlist--header">
      <h5>To Do List</h5>
      <div className="tdl">
        <div className="list--container">
        <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>
          {tasks.length > 0 ? tasks.map((taskItem) => (
            <label key={taskItem._id}>
              <input
                type="checkbox"
                checked={taskItem.done}
                onChange={(e) => handleCheckboxChange(e, taskItem)} 
              />
              <h5 className={taskItem.done ? 'checked' : ''}>
                {taskItem.task}
              </h5>
              <button className={'delete'} onClick={() => handleDelete(taskItem)}><Icon icon="streamline:recycle-bin-2" /></button>
            </label>
         
          )) : <p style={{color:"white"}}>No tasks available.</p>}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;