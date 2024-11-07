import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/tdlist.css';

const ToDoList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/todos')
            .then(response => {
                console.log('Fetched tasks:', response.data);
                setTasks(response.data);  // Set tasks from the fetched data
            })
            .catch(error => {
                console.error('There was an error fetching the ToDo data:', error);
            });
    }, []);

    const handleCheckboxChange = (event, index) => {
        const { checked } = event.target;
        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks];
            updatedTasks[index].IsDone = checked; // Update IsDone instead of isChecked
            return updatedTasks;
        });
    };

    return (
        <div className="tdlist--header">
            <h5>To Do List</h5>
            <div className="tdl">
                <div className="list--container">
                    {tasks.map((taskItem, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                checked={taskItem.IsDone}  // Bind IsDone to checkbox checked
                                onChange={(e) => handleCheckboxChange(e, index)}
                            />
                            <h5 className={taskItem.IsDone ? 'checked' : ''}>
                                {taskItem.Task}
                            </h5>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ToDoList;
