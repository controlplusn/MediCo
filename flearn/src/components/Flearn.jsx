import React from 'react';
import FlearnHeader from './FlearnHeader'; 
import '../styles/flearn.css'; 
import FlearnContent from './FlearnContent';
import FlearnSide from './FlearnSide';

export const Flearn = () => {
  return (
    <div>
      <FlearnHeader />
      <div style={{ display: 'flex', width: '100%' }}>
        <FlearnContent />
        <FlearnSide />
      </div>
    </div>
  );
};

export default Flearn;
