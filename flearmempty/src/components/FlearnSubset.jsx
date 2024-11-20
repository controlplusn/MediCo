import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/flearnempty.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export const FlearnSubset = ({ activeSubset }) => {
    const [flashcard, setFlashcard] = useState(null);
    const userId = '672ca9b1572b8a9dad197f4c';
    const FlashcardId = '5f8d0c2b9d1e8e1a4e5f1015';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:1234/Cards/${userId}`);
                const data = response.data.data.find(flashcard => flashcard._id === FlashcardId);

                if (data) {
                    setFlashcard(data);
                    console.log('Fetched Flashcard:', data);
                } else {
                    setError(new Error('Flashcard not found.'));
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, FlashcardId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Calculate progress percentage
    const progressPercentage =
        activeSubset === 'All Subsets'
            ? flashcard?.statistics?.learnedPercentage || '0.00'
            : flashcard?.subsets?.find(subset => subset.subsetName === activeSubset)?.statistics?.learnedPercentage || '0.00';

    return (
        <div className="progress--container">
            <h5>Progress</h5>
            <CircularProgressbar
                value={parseFloat(progressPercentage)} // Ensure it's a number
                text={`${progressPercentage}%`}
                styles={buildStyles({
                    rotation: 0.25,
                    strokeLinecap: 'round',
                    pathColor: '#4caf50',
                    textColor: '#1E2022',
                    trailColor: '#d6d6d6',
                    textSize: '20px',
                    backgroundColor: '#f3f3f3',
                })}
            />
        </div>
    );
};

export default FlearnSubset;
