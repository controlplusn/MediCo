import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/flearnempty.css';

export const FlashcardHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flearn--header">
      <h5>Anatomy</h5>
      <button onClick={toggleDropdown}>
        All subsets <Icon icon="fe:arrow-down" />
      </button>
      {isDropdownOpen && (
        <div className="dropdown">
          <ul>
            <li>All Subsets</li>
            <button onClick={openModal}>Add Subsets</button>
          </ul>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Subset</h2>
            <input
              type="text"
              placeholder="Enter Subset Name"
              className="modal-input"
            />
            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
              <button>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardHeader;
