import React, { useState, useEffect } from 'react';
import '../styles/cardcontentadd.css';

export const CardContentAdd = ({ activeCard, cardSetId, subsetId, userId }) => {
  const isAddingNew = activeCard === null;
  
  // Manage state for question and answer
  const [question, setQuestion] = useState(isAddingNew ? '' : activeCard?.question);
  const [answer, setAnswer] = useState(isAddingNew ? '' : activeCard?.answer);

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

  const handleSubmit = async () => {
    try {
      const url = isAddingNew
        ? `http://localhost:1234/Cards/${userId}/${cardSetId}/${subsetId}`
        : `http://localhost:1234/UpdateCards/${userId}/${cardSetId}/${subsetId}/${activeCard.cardId}`;

      const method = isAddingNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer }),
      });

      const result = await response.json();
      if (result.success) {
        alert(isAddingNew ? 'Flashcard added successfully!' : 'Flashcard updated successfully!');
      } else {
        alert(result.message || 'Failed to save flashcard.');
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