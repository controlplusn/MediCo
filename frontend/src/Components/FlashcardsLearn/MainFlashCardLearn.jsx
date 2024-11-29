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

  useEffect(() => {
    // Fetch the category data using the categoryId
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/flashcard/card/${categoryId}`);
        setCategory(response.data);
        if (response.data.subsets.length > 0) {
          setActiveSubset(response.data.subsets[0]._id);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [categoryId]);
  console.log('Category:', category)

  return (
    <div className="flearnempty--container">
        <FlashCardContent 
          activeSubset={activeSubset} 
          setActiveSubset={setActiveSubset} 
          categoryId={categoryId}
          category={category}
        />
        <div className="flearncontent">
          <FlearncardContent 
            activeSubset={activeSubset}
            categoryId={categoryId}
            category={category}
          />
          <FlearnSubset 
            activeSubset={activeSubset}
            categoryId={categoryId}
            category={category}
          />
        </div>
    </div>
  )
}

export default MainFlashCardLearn;