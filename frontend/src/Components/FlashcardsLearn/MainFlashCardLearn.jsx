import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import FlashCardContent from './FlashCardContent';
import FlearncardContent from './FlearncardContent';
import FlearnSubset from './FlearnSubset';
import axios from 'axios';
import '../../styles/flearnempty.css';

function MainFlashCardLearn() {
  const [category, setCategory] = useState(null);
  const [activeSubset, setActiveSubset] = useState({ id: 'all', name: 'All Subsets' });
  const { categoryId } = useParams();


  return (
    <div className="flearnempty--container">
        <FlashCardContent 
          activeSubset={activeSubset} 
          setActiveSubset={setActiveSubset} 
          categoryId={categoryId}
       
        />
        <div className="flearncontent">
          <FlearncardContent 
            activeSubset={activeSubset}
            categoryId={categoryId}
     
          />
          <FlearnSubset 
            activeSubset={activeSubset}
            categoryId={categoryId}
      
          />
        </div>
    </div>
  )
}

export default MainFlashCardLearn;