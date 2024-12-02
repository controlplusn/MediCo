import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const FlearnSubset = ({ activeSubset }) => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false); // Track hover state

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

    const getProgressPercentage = () => {
        if (!categoryData) return 0;

        const subsets = categoryData.subsets || [];
        const statistics = categoryData.statistics || {};

        if (activeSubset.name === 'All Subsets') {
            return statistics.learnedPercentage || 0;
        }

        const subset = subsets.find(subset => subset.subsetName === activeSubset.name);
        return subset ? subset.statistics.learnedPercentage || 0 : 0;
    };

    const getProgressInfo = () => {
        if (!categoryData) return { learnedCards: 0, totalCards: 0 };

        const subsets = categoryData.subsets || [];
        const statistics = categoryData.statistics || {};

        if (activeSubset.name === 'All Subsets') {
            return {
                learnedCards: statistics.learnedCards || 0,
                totalCards: statistics.totalCards || 0,
            };
        }

        const subset = subsets.find(subset => subset.subsetName === activeSubset.name);
        return subset
            ? {
                  learnedCards: subset.statistics.learnedCards || 0,
                  totalCards: subset.statistics.totalCards || 0,
              }
            : { learnedCards: 0, totalCards: 0 };
    };

    const progressPercentage = getProgressPercentage();
    const progressInfo = getProgressInfo();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="progress--container">
            <h5>Progress</h5>
            <div
                onMouseEnter={() => setIsHovered(true)} // Set hover state to true
                onMouseLeave={() => setIsHovered(false)} // Set hover state to false
            >
                <CircularProgressbar
                    value={parseFloat(progressPercentage)}
                    text={
                        isHovered
                            ? `Learned: ${progressInfo.learnedCards}\nTotal: ${progressInfo.totalCards}` // Show progress info when hovered
                            : `${progressPercentage}%` // Show percentage by default
                    }
                    styles={buildStyles({
                        rotation: 0.25,
                        strokeLinecap: 'round',
                        pathColor: '#4caf50',
                        textColor: '#1E2022',
                        trailColor: '#d6d6d6',
                        textSize: isHovered ? '6px' : '16px', // Change text size dynamically
                        backgroundColor: '#f3f3f3',
                    })}
                />
            </div>
        </div>
    );
};

export default FlearnSubset;
