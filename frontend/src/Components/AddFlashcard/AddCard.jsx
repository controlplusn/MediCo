import React, { useState } from 'react';
import CardsSide from './CardSide.jsx';
import CardContentAdd from './CardContentAdd.jsx';
import axios from 'axios';
import { useEffect } from 'react';
import '../../styles/addcard.css';

export const AddCard = () => {
  const [activeCard, setActiveCard] = useState(null);

  

  return (
    <div className="addcrd-container">
      <CardsSide
        setActiveCard={setActiveCard}
        userId={userId}
        categoryId={categoryId}
        subsetId={subsetId}
      />
      <CardContentAdd
        activeCard={activeCard}
        userId={userId}
        categoryId={categoryId}
        subsetId={subsetId}
        setActiveCard={setActiveCard} 
      />
    </div>
  );
};

export default AddCard;