import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

function FlashCardContent({ activeSubset, setActiveSubset }) {
  const { categoryId } = useParams(); // Get the category ID from the URL
  const [flashcard, setFlashcard] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubset, setNewSubset] = useState('');
  const [selectedSubset, setSelectedSubset] = useState(null);

  // Add the state for getting the userId here...
  const [userId, setUserId] = useState(null);

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


  // Fetching the cards data -> filtered to show only the selected subset
  useEffect(() => {
    const fetchCategoryData = async () => {

      if (!userId) {
        console.error('No userId available');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}`); // getting the category id
        console.log("URL:", response);

        if (response.data.success) {
          setCategoryData(response.data.data);

          // If we have a selected subset, fetch its specific cards
          if (selectedSubset && selectedSubset !== "All Subsets") {
            const subsetResponse = await axios.get(
                `http://localhost:3001/api/flashcard/cards/${categoryId}/${selectedSubset._id}`
            );
            console.log("Subset response:", subsetResponse);
            
            if (subsetResponse.data.success) {
                // Update only this subset's cards in the categoryData
                setCategoryData(prevData => ({
                    ...prevData,
                    subsets: prevData.subsets.map(subset =>
                        subset._id === selectedSubset._id
                            ? { ...subset, cards: subsetResponse.data.data.cards }
                            : subset
                    )
                }));
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
 
    if (userId) {
      fetchCategoryData();
    }

  }, [categoryId, userId]);

  // toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  // for selecting the subset
  const selectSubset = (subset) => {
    setSelectedSubset(subset === 'All Subsets' ? null : subset);
    setActiveSubset(subset === 'All Subsets' ? 'All Subsets' : subset.subsetName);
    setIsDropdownOpen(false); // Close the dropdown
  };

  // adding of subset modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false); 
  };

  // closing modal for adding subset
  const closeModal = () => {
    setIsModalOpen(false);
    setNewSubset(""); // Reset input field when closing the modal
  };

  // adding new subset 
  const handleAddSubset = async (e) => {
    e.preventDefault();

    if (!newSubset.trim()) {
      console.log('Subset name is required');
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/flashcard/cards/${categoryId}/addSubset`,
        { subsetName: newSubset }
      );

      if (response.data.success) {
        console.log("New subset added:", response.data.updatedFlashcard);
        const newSubsetData = response.data.updatedFlashcard.subsets.find(
          (subset) => subset.subsetName === newSubset
        );
        
        // Update the state to reflect the new subset
        setCategoryData((prevData) => ({
          ...prevData,
          subsets: [...prevData.subsets, newSubsetData],
        }));

          selectSubset(newSubsetData)
          closeModal();
        } else {
          console.log("Faile to add subset");
        }

    } catch (error) {
      console.error('Error adding subset:', error);
      setError(new Error('Error adding subset.'));
    }
  }
  
  // loading and error component
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='flearn--header'>
      <h2>{categoryData?.name} Flashcards</h2>

      <button onClick={toggleDropdown}>
        {activeSubset} <Icon icon="fe:arrow-down" />
      </button>

      {isDropdownOpen && (
        <div className="dropdown">
          <ul>
            {/* fix all subset here */}
            <li onClick={() => selectSubset('All Subsets')}>All Subsets</li>
            {categoryData?.subsets.map((subset) => (
              <li key={subset.subsetId} onClick={() => selectSubset(subset)}>
                {subset.subsetName}
              </li>
            ))}
            <button onClick={openModal}>Add Subsets</button>
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Subset</h2>
            <form onSubmit={handleAddSubset}>
              <input
                type="text"
                placeholder="Enter subset name"
                value={newSubset}
                onChange={(e) => setNewSubset(e.target.value)}
              />
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Close
                </button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashCardContent;