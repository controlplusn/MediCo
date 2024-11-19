import React from 'react';
import { Icon } from '@iconify/react';
import '../styles/classcontent.css';

// Array of class cards data
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
  return (
    <div>
      <div className="add-icon">
        <Icon icon="material-symbols:add" />
      </div>
      <section className="Card--section">
        {classCards.map((card) => (
          <button className="Card" key={card.id}>
            <div className="flashcard--head">
              <img src={card.profileImage} alt="profile" />
              <Icon icon="oi:ellipses" />
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
