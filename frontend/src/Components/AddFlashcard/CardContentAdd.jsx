import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/cardcontentadd.css';
import { useParams } from 'react-router-dom';

const CardContentAdd = ({ activeCard, userId, category }) => {
  // Determine if we're adding a new card or editing an existing one
  const isAddingNew = activeCard === null;

  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Manage state for question and answer
  const [question, setQuestion] = useState(isAddingNew ? '' : activeCard?.question);
  const [answer, setAnswer] = useState(isAddingNew ? '' : activeCard?.answer);
  const { categoryId, subsetId } = useParams();
  console.log('Params in AddCard:', { categoryId, subsetId });

  // fetch category id and subset id
  useEffect(() => {
    const fetchCategoryData = async () => {
      console.log('Fetching category data with:', { categoryId, subsetId, userId });
      if (!categoryId || !subsetId) {
        console.error('No category ID or subset ID provided');
        return;
      }
        
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}/${subsetId}`, {
            withCredentials: true,
          });

          if (response.data.success) {
              setActiveCategory(response.data.data);
              console.log('Fetched Category Data:', response.data.data)
          } else {
              console.error(response.data.message || 'Failed to fetch flashcard data');
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (categoryId && subsetId && userId) {
      fetchCategoryData();
    } else {
      console.log('Missing data for fetch:', { categoryId, subsetId, userId });
    }
    
  }, [categoryId, subsetId, userId]);

  // Re-run the effect whenever activeCard changes (for updating existing card)
  useEffect(() => {
    if (!isAddingNew && activeCard) {
      setQuestion(activeCard.question);
      setAnswer(activeCard.answer);
    } else {
      // Reset to empty values if adding new card
      setQuestion('');
      setAnswer('');
    }
  }, [activeCard, isAddingNew]); // Dependency on activeCard and isAddingNew

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isAddingNew
        ? `http://localhost:3001/api/flashcard/cards/${categoryId}/${subsetId}`
        : `http://localhost:3001/api/flashcard/cards/${categoryId}/${subsetId}/${activeCard._id}`;

      const method = isAddingNew ? 'POST' : 'PUT';

      const response = await axios({
        method,
        url,
        data: { question, answer },
        withCredentials: true,
      });

      if (response.data.success) {
        alert(isAddingNew ? 'Flashcard added successfully!' : 'Flashcard updated successfully!');
        // Reset form if adding new card
        if (isAddingNew) {
          setQuestion('');
          setAnswer('');
        }
      } else {
        alert(response.data.message || 'Failed to save flashcard.');
      }
    } catch (error) {
      console.error('Error saving flashcard:', error);
      alert('An error occurred while saving the flashcard.');
    }
  };

  return (
    <div className="cardcontentadd">
      <div className="cardquestion">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the question"
        />
        <h5>Question</h5>
      </div>
      <div className="cardanswer">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the answer"
        />
        <h5>Answer</h5>
      </div>
      <button onClick={handleSubmit}>
        {isAddingNew ? 'Add Flashcard' : 'Update Flashcard'}
      </button>
    </div>
  );
};

export default CardContentAdd;