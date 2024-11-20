import React from 'react';
import FlashcardHeader from './FlashcardHeader';
import FlearncardContent from './FlearncardContent';
import '../styles/flearnempty.css';
import FlearnSubset from './FlearnSubset';

export const FlearnFlashcardContent = () => {
  return (
    <div className="flearnempty--container">
        <FlashcardHeader />
        <div className="flearncontent">
        <FlearncardContent />
        <FlearnSubset />      
        </div>
     
        
    </div>
  );
};

export default FlearnFlashcardContent;