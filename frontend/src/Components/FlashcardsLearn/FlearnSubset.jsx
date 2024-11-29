import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const FlearnSubset = ({ activeSubset }) => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const [flashcard, setFlashcard] = useState(null);
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

    // Calculate progress percentage
    const progressPercentage = categoryData 
    ? (activeSubset.name === 'All Subsets'
        ? categoryData.statistics.learnedPercentage // If 'All Subsets' is active, use the learned percentage from the category's statistics
        : categoryData.subsets.find(subset => subset.subsetName === activeSubset.name).statistics.learnedPercentage // If a specific subset is active, find its learned percentage
    ) 
    : 0.00;
            
    console.log('hdaosjdoa: ',categoryData);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


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
    )
}

export default FlearnSubset