import React, { useState } from 'react';
import '../assets/styles/tdlist.css';

const ToDoList = () => {
    
    const [checkedItems, setCheckedItems] = useState({
        bioAssignment: false,
        wagICram: false,
        createIndexCard: false,
        reviewChem: false
    });

    
    const handleCheckboxChange = (event, item) => {
        const { checked } = event.target;
        setCheckedItems(prevState => ({
            ...prevState,
            [item]: checked 
        }));
    };

    return (
        <div className="tdlist--header">
            <h5>To Do List</h5>
            <div className="tdl">
                <div className="list--container">
                    <label>
                        <input
                            type="checkbox"
                            checked={checkedItems.bioAssignment}  
                            onChange={(e) => handleCheckboxChange(e, 'bioAssignment')} 
                        />
                        <h5>Assignment in Bio!?!?</h5>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={checkedItems.wagICram}   // Controlled checkbox
                            onChange={(e) => handleCheckboxChange(e, 'wagICram')}  // Handle checkbox change
                        />
                        <h5>Wag i-cram retdem</h5>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={checkedItems.createIndexCard}   
                            onChange={(e) => handleCheckboxChange(e, 'createIndexCard')}  
                        />
                        <h5>Create index card for physio</h5>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={checkedItems.reviewChem}   
                            onChange={(e) => handleCheckboxChange(e, 'reviewChem')} 
                        />
                        <h5>Review 4 chem</h5>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ToDoList;
