import React from 'react';
import { Icon } from '@iconify/react';
import '../styles/cardside.css';

const Card = ({ question, answer }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5>{question}</h5>
      </div>
      <h6>{answer}</h6>
    </div>
  );
};

export const CardsSide = () => {
  return (
    <div className="fcards-container">
      <div className="fcards-header">
        <button><Icon icon="material-symbols:add"/></button>
      </div>
      <div className="cards-list">
        <Card
          question="Intro to Physiology"
          answer="The study of physiology is, in a sense, the study..."
        />
                        <hr />

        <Card
          question="Intro to Physiology"
          answer="The study of physiology is, in a sense, the study..."
        />
                            <hr />

      </div>
    </div>
  );
};

export default CardsSide;
