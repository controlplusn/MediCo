import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import '../styles/flashcard.css';

export const Flashcard = (username) => {
  const [activeTab, setActiveTab] = useState('active');  

  const categories = [
    { name: 'Anatomy', subsets: 2, total: 20 },
    { name: 'Physics', subsets: 3, total: 25 },
    { name: 'Chemistry', subsets: 1, total: 15 },
    { name: 'Biology', subsets: 4, total: 30 }
  ];

  return (
    <div className="flashcard--container">
      <div className="flashcard--header">
        <h4>Flash Cards</h4>
      </div>

      <div className="flashcard--navbar">
        <h6 
          onClick={() => setActiveTab('active')} 
          className={activeTab === 'active' ? 'active' : ''}
        >
          Active
        </h6>
        <h6 
          onClick={() => setActiveTab('archived')} 
          className={activeTab === 'archived' ? 'active' : ''}
        >
          Archived
        </h6>
      </div>

      <section className="Card--section">
        {categories.map((category, index) => (
          <button className="Card" key={index}>
            <div className="flashcard--head">
              <Icon icon="oi:ellipses" />
            </div>
            <div className="flashcard--body">
              <h5>{category.name}</h5>
              <progress value={50} max={100}></progress>
              <div className="content--h6">
                <h6>{category.subsets} Subsets <span className="vertical-line"></span>{category.total} Flashcards</h6>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Flashcard;
