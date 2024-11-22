import React, { useState } from 'react'
import FlashCardContent from './FlashCardContent';
import FlearncardContent from './FlearncardContent';
import '../../styles/flearnempty.css';

function MainFlashCardLearn() {
  const [activeSubset, setActiveSubset] = useState('All Subsets');

  return (
    <div className="flearnempty--container">
        <FlashCardContent activeSubset={activeSubset} setActiveSubset={setActiveSubset} />
        <div className="flearncontent">
          <FlearncardContent activeSubset={activeSubset} />
        </div>
    </div>
  )
}

export default MainFlashCardLearn;