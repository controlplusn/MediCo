import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/cardcontentadd.css';

const CardContentAdd = ({ activeCard }) => {
  const isAddingNew = activeCard === null;
  
  // Manage state for question and answer
  const [question, setQuestion] = useState(isAddingNew ? '' : activeCard?.question);
  const [answer, setAnswer] = useState(isAddingNew ? '' : activeCard?.answer);
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubset, setActiveSubset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // used for userId passed from api JWT authentication
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
          withCredentials: true,
        });
        if (response.data.user) {
          setUserId(response.data.user._id);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      }
    };

    fetchUser();
  }, []);

  // fetch category id and subset id
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/flashcard/cards`, {
          withCredentials: true
        });

        if (response.data.success) {
          setCategories(response.data.data);
          const firstCategory = response.data.data[0];
          if (firstCategory) {
            setActiveCategory(firstCategory._id);
            const firstSubset = firstCategory.subsets[0];
            if (firstSubset) {
              setActiveSubset(firstSubset.subsetId);
            }
          }

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
  }, []);

  // Update question and answer when editing an existing card or resetting when adding a new card
  useEffect(() => {
    if (!isAddingNew && activeCard) {
        setQuestion(activeCard.question);
        setAnswer(activeCard.answer);
    } else {
        setQuestion('');
        setAnswer('');
    }
  }, [activeCard, isAddingNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isAddingNew
        ? `http://localhost:3001/api/flashcard/cards/addflashcard`
        : `http://localhost:3001/api/flashcard/cards/updateCard`;

      const method = isAddingNew ? 'POST' : 'PUT';

      const response = await axios({
        method,
        url,
        data: {
          userId,
          cardSetId: activeCategory,
          subsetId: activeSubset,
          question,
          answer,
        },
        withCredentials: true
      });

      console.log(response);
      if (response.data.success) {
        alert(isAddingNew ? 'Flashcard added successfully!' : 'Flashcard updated successfully!');
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
      <button className='addflashcard--btn' onClick={handleSubmit}>
        {isAddingNew ? 'Add Flashcard' : 'Update Flashcard'}
      </button>
    </div>
  );
};

export default CardContentAdd;