import React from 'react';
import '../../styles/card.css';

const Card = () => {
    const handleCardClick = (subject) => {
        console.log(`${subject} card clicked`);
    };

    return (
        <div className="card--container">
            <h5 className="card--header">Recent Task</h5>
            <div className="cards">
                <button className="card--item" onClick={() => handleCardClick('Biochemistry')}>
                    <div className="images--icon">
                        <img src="https://via.placeholder.com/10" alt="Biochemistry icon" />
                        <img src="https://via.placeholder.com/10" alt="Biochemistry icon" />
                        <img src="https://via.placeholder.com/10" alt="Biochemistry icon" />
                    </div>
                    <h2>Biochemistry</h2>
                    <progress value={0.3} max={1}></progress>
                    <h5>
                        5 tasks <span className="vertical-line"></span> 30%
                    </h5>
                </button>
                <button className="card--item" onClick={() => handleCardClick('Anatomy')}>
                    <div className="images--icon">
                        <img src="https://via.placeholder.com/10" alt="Anatomy icon" />
                        <img src="https://via.placeholder.com/10" alt="Anatomy icon" />
                        <img src="https://via.placeholder.com/10" alt="Anatomy icon" />
                    </div>
                    <h2>Anatomy</h2>
                    <progress value={0.8} max={1}></progress>
                    <h5>
                        25 tasks <span className="vertical-line"></span> 80%
                    </h5>
                </button>
                <button className="card--item" onClick={() => handleCardClick('Physiology')}>
                    <div className="images--icon">
                        <img src="https://via.placeholder.com/10" alt="Physiology icon" />
                        <img src="https://via.placeholder.com/10" alt="Physiology icon" />
                        <img src="https://via.placeholder.com/10" alt="Physiology icon" />
                    </div>
                    <h2>Physiology</h2>
                    <progress value={0.5} max={1}></progress>
                    <h5>
                        15 tasks <span className="vertical-line"></span> 50%
                    </h5>
                </button>
            </div>
        </div>
    );
};

export default Card;