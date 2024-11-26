import React from 'react';
import FlearnHeader from './FlearnHeader'; 
// import FlearnContent from './FlearnContent';
// import FlearnSide from './FlearnSide';
import '../../styles/flearn.css';


export const Flearn = () => {
  return (
    <div>
        <FlearnHeader />
        <div style={{ display: 'flex', width: '100%' }}>
            {/* <FlearnContent />
            <FlearnSide/> */}
        </div>
    </div>
  );
};