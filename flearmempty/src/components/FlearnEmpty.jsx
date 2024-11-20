import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/flearnempty.css';

export const FlearnEmpty = () => {
  // State to manage dropdown and modal visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle the dropdown menu visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Open the modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when modal opens
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flearnempty--container">
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
      </div>
      <div className="flearn--content">
        <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
        <button>
          Add <Icon icon="material-symbols-light:add" />
        </button>
      </div>

      {/* Modal */}
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

export default FlearnEmpty;
