import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function FlashCardContent() {
  const { categoryId } = useParams(); // Get the category ID from the URL
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}`);
        if (response.data.success) {
          setCategoryData(response.data.data);
        } else {
          setError(new Error(response.data.message));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{categoryData?.name} Flashcards</h2>
      {categoryData?.subsets.map((subset, index) => (
        <div key={index}>
          <h3>{subset.subsetName}</h3>
          {/* Render flashcards for each subset */}
          {subset.cards.map((card, cardIndex) => (
            <div key={cardIndex}>
              <p>{card.question}</p>
              <p>{card.answer}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FlashCardContent;