import React, { useState } from 'react';
import '../assets/styles/tdlist.css'

const ToDoList = () => {
    //Declare state for the checkbox
    const [isChecked, setIsChecked] = useState(false);

    //Handle the change when the checkbox is clicked
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <div className='tdlist--header'>
        <h5>To Do List</h5>
        <div className="tdl">
            <div className="list--container">
                <label>
                    <input 
                        type="checkbox"
                        checked={isChecked}   //Controlled checkbox
                        onChange={handleCheckboxChange}  // Handle checkbox change
                    />
                    <h5>Assignment in Bio!?!?</h5>
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={isChecked}   // Controlled checkbox
                        onChange={handleCheckboxChange}  // Handle checkbox change
                    />
                    <h5>Wag i-cram retdem</h5>
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={isChecked}   // Controlled checkbox
                        onChange={handleCheckboxChange}  // Handle checkbox change
                    />
                    <h5>Create index card for physio</h5>
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={isChecked}   // Controlled checkbox
                        onChange={handleCheckboxChange}  // Handle checkbox change
                    />
                    <h5>Review 4 chem</h5>
                </label>
            </div>
        </div>
        </div>
    );
};

export default ToDoList;
