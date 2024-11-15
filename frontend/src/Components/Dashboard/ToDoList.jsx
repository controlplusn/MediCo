import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/tdlist.css'
import { Icon } from '@iconify/react';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
          withCredentials: true,
        });
        if (response.data.user) {
          setUserId(response.data.user._id);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      }
    };

    fetchUser();
  }, []);


  useEffect(() => {
    const fetchTasks = async () => {

      if (!userId) {
        console.error('No userId available');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/todos/todo', {
          withCredentials: true,
        });


        const sortedTasks = sortTasks(response.data.ToDo || []);
        setTasks(sortedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      return a.done === b.done ? 0 : a.done ? 1 : -1; 
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault(); 

    if (!newTask.trim()) return; // Check if the input is empty
    if (!userId) {
      console.error('No user ID available. Cannot add task.');
      return; // Prevent adding task if userId is not available
    }

    try {
        console.log("Adding task for userId:", userId);
        const response = await axios.post('http://localhost:3001/api/todos/add', {
            task: newTask, // This is where the task value is sent
            done: false // Set done to false for new tasks
        }, {
          withCredentials: true
        });

        // Add the new task to the state and sort the tasks
        const updatedTasks = [...tasks, response.data];
        setTasks(sortTasks(updatedTasks)); // Sort the tasks after adding the new one
        setNewTask(''); // Clear the input field
       
    } catch (err) {
        console.error('Error adding task:', err); // Handle any errors
    }
  };

  const handleCheckboxChange = async (e, taskItem) => {
    const updatedDoneStatus = e.target.checked;
    console.log(`Updating task "${taskItem.task}" for user ${userId} to done: ${updatedDoneStatus}`);

    try {
      const response = await axios.put('http://localhost:3001/api/todos/update', {
        taskValue: taskItem.task,
        done: updatedDoneStatus
      }, { withCredentials: true });

      const updatedTasks = tasks.map(t =>
        t.task === taskItem.task ? { ...t, done: updatedDoneStatus } : t
      );  // mapping -> DSA

      setTasks(sortTasks(updatedTasks));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async (taskItem) => {
    console.log(`Deleting task "${taskItem.task}" for user ${userId}`);

    try {
      await axios.delete(`http://localhost:3001/api/todos/delete`, {
        data: { taskValue: taskItem.task },
        withCredentials: true
      });

      setTasks(tasks.filter(t => t.task !== taskItem.task));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };


  return (
    <div className="tdlist--header">
      <h3 className='tdlist-headerTitle'>To Do List</h3>
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