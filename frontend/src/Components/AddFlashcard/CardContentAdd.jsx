import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../styles/cardcontentadd.css';

const CardContentAdd = ({ userId, categoryId, subsetId }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedQuestion = question.trim();
        const trimmedAnswer = answer.trim();

        if (!userId || !categoryId || !subsetId || !trimmedQuestion || !trimmedAnswer) {
            alert('All fields are required');
            return;
        }

        console.log("Sending data:", { cardSetId: categoryId, subsetId, question: trimmedQuestion, answer: trimmedAnswer });

        try {

            const response = await axios.post(
                `http://localhost:3001/api/flashcard/cards/addflashcard`,
                { 
                    cardSetId: categoryId, // Use categoryId as cardSetId
                    subsetId,
                    question: trimmedQuestion,
                    answer: trimmedAnswer  
                },
                { 
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                alert('Flashcard added successfully!');
                setQuestion('');
                setAnswer('');
            } else {
                alert(response.data.message || 'Failed to add flashcard.');
            }
        } catch (error) {
            console.error('Error adding flashcard:', error);
            alert('An error occurred while adding the flashcard.');
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
                Add Flashcard
            </button>
        </div>
    );
}

export default CardContentAdd;