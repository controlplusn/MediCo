import React from 'react';
import FlearnHeader from './FlearnHeader'; 
import '../styles/flearn.css'; 
import FlearnContent from './FlearnContent.jsx';
import FlearnSide from './FlearnSide';
import Pomodoro from './Pomodoro.jsx';

export const FlearnPomodoro = () => {
  return (
    <div>
      <FlearnHeader />
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Pomodoro />
        
        <div style={{ display: 'flex', width: '100%' }}>
          <FlearnContent />
          <FlearnSide />
        </div>
      </div>
    </div>
  );
};

export default FlearnPomodoro;
