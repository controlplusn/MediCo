import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/cardcontentadd.css';

const CardContentAdd = ({ userId, categoryId, subsetId, activeCard, triggerCardUpdate }) => {
    const [formData, setFormData] = useState({
        question: '',
        answer: ''
    });
    //console.log('subsetId:', subsetId);

    useEffect(() => {
        if (activeCard) {
            setFormData({
                question: activeCard.question,
                answer: activeCard.answer
            });
        } else {
            setFormData({
                question: '',
                answer: ''
            });
        }
    }, [activeCard]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { question, answer } = formData;
        const trimmedQuestion = question.trim();
        const trimmedAnswer = answer.trim();
    
        // Validation check for required fields
        if (!userId || !categoryId || !trimmedQuestion || !trimmedAnswer) {
            alert('All fields are required');
            return;
        }
    
        let targetSubsetId = subsetId; // Default to provided subsetId
    
        try {
            // If subsetId is not provided, fetch the "All Subsets" subset
            if (subsetId == 'all') {
                console.log("Subset ID not provided. Looking for 'All Subsets'...");
                const response = await axios.get(
                    `http://localhost:3001/api/flashcard/cards/${categoryId}`,
                    { withCredentials: true }
                );
    
                const cardSet = response.data.data; // Assuming API returns the card set
                const allSubsets = cardSet.subsets.find(subset => subset.subsetName === "All Subsets");
    
                if (!allSubsets) {
                    alert("'All Subsets' subset not found. Please select a valid subset.");
                    return;
                }
    
                targetSubsetId = allSubsets._id; // Use the ID of "All Subsets"
                console.log("Using subset ID:", targetSubsetId);
            }
    
            let response;
    
            if (activeCard) {
                // Update existing card if activeCard exists
                response = await axios.put(
                    `http://localhost:3001/api/flashcard/UpdateCards/${categoryId}/${targetSubsetId}/${activeCard._id}`,
                    { question: trimmedQuestion, answer: trimmedAnswer },
                    { withCredentials: true }
                );
    
                if (response.data.success) {
                    console.log('Flashcard updated successfully!');
                }
            } else {
                // Add new flashcard if no activeCard exists
                response = await axios.post(
                    `http://localhost:3001/api/flashcard/cards/addflashcard`,
                    {
                        cardSetId: categoryId,
                        subsetId: targetSubsetId,
                        question: trimmedQuestion,
                        answer: trimmedAnswer
                    },
                    { withCredentials: true }
                );
    
                if (response.data.success) {
                    console.log('Flashcard added successfully!');
                }
            }
    
            // Reset form and trigger card update after success
            setFormData({ question: '', answer: '' });
            triggerCardUpdate();
        } catch (error) {
            console.error('Error submitting flashcard:', error);
            alert('An error occurred while submitting the flashcard.');
        }
    };
    

   
    

    return (
        <div className="cardcontentadd">
            <div className="cardquestion">
                <h5>Question</h5>
                <textarea
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the question"
                />
            </div>
            <div className="cardanswer">
                <h5>Answer</h5>
                <textarea
                    type="text"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Enter the answer"
                />
            </div>
            <button onClick={handleSubmit} className="btncardcontent">
                {activeCard ? 'Update Flashcard' : 'Add Flashcard'} 
            </button>
        </div>
    );
};

export default CardContentAdd;
