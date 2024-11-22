import React, { useState } from 'react';
import CardContentAdd from './CardContentAdd.jsx';
import CardSide from './CardSide.jsx';
import '../../styles/addcard.css';

export const AddCard = () => {
  const [activeCard, setActiveCard] = useState(null);


  return (
    <div className="addcrd-container">
      <CardSide/>
      <CardContentAdd
        activeCard={activeCard}
      />
    </div>
  );
};

export default AddCard;