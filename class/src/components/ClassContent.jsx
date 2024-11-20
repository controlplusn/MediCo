import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/classcontent.css';

const classCards = [
  {
    id: 1,
    title: 'Anatomy',
    author: 'Doc_Iorem123',
    profileImage: 'https://via.placeholder.com/50',
  },
  {
    id: 2,
    title: 'Biochemistry',
    author: 'Mr_yoso777',
    profileImage: 'https://via.placeholder.com/50',
  },
  {
    id: 3,
    title: 'Microbiology',
    author: 'John_John_John',
    profileImage: 'https://via.placeholder.com/50',
  },
  {
    id: 4,
    title: 'Physiology',
    author: 'Your_Name',
    profileImage: 'https://via.placeholder.com/50',
  },
];

export const ClassContent = () => {
  // State to track the visibility of dropdowns for each card
  const [dropdownState, setDropdownState] = useState({});
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle dropdown visibility for a specific card
  const toggleDropdown = (id) => {
    setDropdownState(prevState => ({
      ...prevState,
      [id]: !prevState[id] // Toggle the dropdown for the specific card
    }));
  };

  // Toggle the modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <div>
      <div className="add-icon">
        <button onClick={toggleModal}><Icon icon="material-symbols:add" /></button>
      </div>
      
      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Class</h2>
              <button className="close-btn" onClick={toggleModal}><Icon icon="material-symbols:close"/></button>
            </div>
            <div className="modal-body">
              <input type="text" placeholder="Class Title" />
              <button onClick={toggleModal}>Add Class</button>
            </div>
          </div>
        </div>
      )}

      <section className="Card--section">
        {classCards.map((card) => (
          <button className="Card" key={card.id}>
            <div className="flashcard--head">
              <img src={card.profileImage} alt="profile" />
              <button onClick={() => toggleDropdown(card.id)}>
                <Icon icon="oi:ellipses" />
              </button>
              {dropdownState[card.id] && (
                <div className="dropdown-menu">
                  <ul>
                    <li>Edit</li>
                    <li>Delete</li>
                    <li>Share</li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flashcard--body">
              <h5>{card.title}</h5>
              <div className="content--h6">
                <h6>By {card.author}</h6>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default ClassContent;
