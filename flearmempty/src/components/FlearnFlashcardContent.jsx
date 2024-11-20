import React, { useState } from 'react';
import FlashcardHeader from './FlashcardHeader';
import FlearncardContent from './FlearncardContent';
import '../styles/flearnempty.css';
import FlearnSubset from './FlearnSubset';

export const FlearnFlashcardContent = () => {
  const [activeSubset, setActiveSubset] = useState('All Subsets'); // State for the active subset

  return (
    <div className="flearnempty--container">
      <FlashcardHeader activeSubset={activeSubset} setActiveSubset={setActiveSubset} />
      <div className="flearncontent">
        <FlearncardContent activeSubset={activeSubset} />
        <FlearnSubset activeSubset={activeSubset}/>
      </div>
    </div>
  );
};

export default FlearnFlashcardContent;
