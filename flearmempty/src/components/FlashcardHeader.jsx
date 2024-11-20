import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import '../styles/flearnempty.css';

export const FlashcardHeader = ({ activeSubset, setActiveSubset }) => {
    const [flashcard, setFlashcard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSubsetName, setNewSubsetName] = useState(""); // New state to store the subset name

    const userId = '672ca9b1572b8a9dad197f4c';
    const FlashcardId = '5f8d0c2b9d1e8e1a4e5f1015';

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectSubset = (subsetName) => {
        setActiveSubset(subsetName); // Update the active subset in the parent
        setIsDropdownOpen(false); // Close the dropdown
    };

    const openModal = () => {
        setIsModalOpen(true);
        setIsDropdownOpen(false); 
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewSubsetName(""); // Reset input field when closing the modal
    };

    // Handle the form submission to add a new subset
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!newSubsetName.trim()) {
            alert("Subset name is required.");
            return;
        }

        try {
            // Sending POST request to add the new subset to the backend
            const response = await axios.post(`http://localhost:1234/Cards/${userId}/${FlashcardId}/addSubset`, {
                subsetName: newSubsetName
            });

            if (response.data.success) {
                console.log("New subset added:", response.data.updatedFlashcard);
                setFlashcard(response.data.updatedFlashcard); // Update the flashcard with the new subset
                closeModal(); // Close the modal after successful submission
            }
        } catch (error) {
            console.error("Error adding subset:", error);
            setError(new Error("Error adding subset"));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flearn--header">
            <h5>{flashcard.name}</h5> {/* Display the active subset */}
            <button onClick={toggleDropdown}>
                {activeSubset} <Icon icon="fe:arrow-down" />
            </button>
            {isDropdownOpen && (
                <div className="dropdown">
                    <ul>
                        <li onClick={() => selectSubset('All Subsets')}>All Subsets</li>
                        {flashcard.subsets?.map(subset => (
                            <li key={subset.subsetId} onClick={() => selectSubset(subset.subsetName)}>
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
                        <form onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                placeholder="Enter Subset Name"
                                className="modal-input"
                                value={newSubsetName}
                                onChange={(e) => setNewSubsetName(e.target.value)} // Update the input field value
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
};

export default FlashcardHeader;
  