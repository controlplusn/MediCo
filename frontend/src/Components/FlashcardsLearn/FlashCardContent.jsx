import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';

function FlashCardContent({ activeSubset, setActiveSubset, categoryId, subsetId }) {
  console.log('FlashCardContent props:', { activeSubset, categoryId, subsetId });
  
  // state management
  const [flashcard, setFlashcard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subsetName, setSubsetName] = useState('');
  const [userId, setUserId] = useState(null);

  // fetch the user Id from JWT
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

  // Data fetching
  useEffect(() => {
      const fetchCategories = async () => {
          if (!categoryId) {
              setError(new Error('No category ID provided'));
              setLoading(false);
              return;
          }
          
          if (userId) {
            try {
              const response = await axios.get(`http://localhost:3001/api/flashcard/cards/${categoryId}`, {
                withCredentials: true,
              });

              if (response.data.success) {
                  setFlashcard(response.data.data);
                  console.log('Fetched Flashcard:', response.data.data)
              } else {
                  setError(new Error(response.data.message || 'Failed to fetch flashcard data'));
              }
            } catch (error) {
              console.error('Error fetching categories:', error);
              setError(error);
            } finally {
              setLoading(false);
            }
          }
      };

      fetchCategories();
      
  }, [categoryId, userId]);

  // Dropdown functionality
  const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
  };

  const selectSubset = (subset) => {
      setActiveSubset(subset); // Update the active subset in the parent
      setIsDropdownOpen(false); // Close the dropdown
  };

  // Modal for adding new subsets
  const openModal = () => {
      setIsModalOpen(true);
      setIsDropdownOpen(false); 
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSubsetName(""); // Reset input field when closing the modal
  };


  // Adding new subsets
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!subsetName.trim()) {
        alert("Subset name is required.");
        return;
    }

    try {
        // Sending POST request to add the new subset to the backend
        const response = await axios.post(`http://localhost:3001/api/flashcard/cards/${categoryId}/addSubset`, {
            subsetName: subsetName
        }, {
            withCredentials: true
        });

        if (response.data.success) {
            console.log("New subset added:", response.data.updatedFlashcard);
            setFlashcard(response.data.updatedFlashcard); // Update the flashcard with the new subset

            // Store the new subset ID
            const newSubsetId = response.data.newSubsetId;
            console.log("New subset ID:", newSubsetId);

            // Set the new subset as active
            setActiveSubset({ id: newSubsetId, name: subsetName });

            closeModal(); // Close the modal after successful submission
            setSubsetName('');
        } else {
            setError(new Error(response.data.message || "Failed to add subset"));
        }
    } catch (error) {
        console.error("Error adding subset:", error);
        setError(new Error("Error adding subset"));
    }
  };


  // Error and loading handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  

  return (
    <div className='flearn--header'>
      <h5>{flashcard?.name}</h5> {/* Display the active subset */}
            <button onClick={toggleDropdown}>
                {activeSubset.name || 'Select Subset'} <Icon icon="fe:arrow-down" />
            </button>
            {isDropdownOpen && (
                <div className="dropdown">
                    <ul>
                        <li onClick={() => selectSubset({ id: 'all', name: 'All Subsets' })}>All Subsets</li>
                        {flashcard?.subsets
                          ?.filter(subset => subset.subsetName !== 'All Subsets')
                          .map(subset => (
                            <li key={subset._id} onClick={() => selectSubset({ id: subset._id, name: subset.subsetName })}>
                              {subset.subsetName}
                            </li>
                          ))
                        }
                        <button onClick={openModal}>Add Subsets</button>
                    </ul>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Subset</h2>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                placeholder="Enter Subset Name"
                                className="modal-input"
                                value={subsetName}
                                onChange={(e) => setSubsetName(e.target.value)} // Update the input field value
                            />
                            <div className="modal-actions">
                                <button type="button" onClick={closeModal}>Close</button>
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