import React from 'react';
import '../assets/styles/card.css';

const Card = () => {
    return (
        <div className="card--container">
            <h5 className="card--header">Recent Task</h5>
            <div className="cards">
                <div className="card--item">
                    <div className="images--icon">
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                    </div>
                    <h3>Biochemistry</h3>
                    <progress value={0.3} max={1}></progress>
                    <h6>
                        5 tasks <span className="vertical-line"></span> 30%
                    </h6>
                </div>
                <div className="card--item">
                    <div className="images--icon">
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                    </div>
                    <h3>Anatomy</h3>
                    <progress value={0.8} max={1}></progress>
                    <h6>
                        25 tasks <span className="vertical-line"></span> 80%
                    </h6>
                </div>
                <div className="card--item">
                    <div className="images--icon">
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                        <img src="https://via.placeholder.com/10" alt="image-icon" />
                    </div>
                    <h3>Physiology</h3>
                    <progress value={0.5} max={1}></progress>
                    <h6>
                        15 tasks <span className="vertical-line"></span> 50%
                    </h6>
                </div>
            </div>
        </div>
    );
};

export default Card;
