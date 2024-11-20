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
        <FlearnContent useeId='672ca9b1572b8a9dad197f4c' />
        <FlearnSide />
      </div>
    </div>
  );
};

export default Flearn;
