import React from 'react';
import '../../styles/greetings.css';

const Greetings = () => {
    return (
        <div className="greetings--container">
            <div className="greetings--header">
                <div className="routine">
                    <h5 className="greet">Good Day!</h5>
                    <h3 className="greet">Check your Daily Tasks & Schedules</h3>
                </div>
                <div className="humandoctor">
                    <img src="https://via.placeholder.com/100" alt="human doctor" />
                </div>
            </div>
        </div>
    );
};

export default Greetings;
