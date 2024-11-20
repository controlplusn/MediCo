import React from 'react';
import '../styles/flearnempty.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const percentage = 66;

export const FlearnSubset = () => {
  return (
    <div className="progress--container">
      <h5>Progress</h5>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          rotation: 0.25, 
          strokeLinecap: 'round',
          pathColor: '#4caf50', 
          textColor: '#1E2022', 
          trailColor: '#d6d6d6', 
          textSize: '20px',  // Adjusted text size for better visibility inside the circle
          backgroundColor: '#f3f3f3', 
        })}
      />
    </div>
  );
};

export default FlearnSubset;
