import React, { useState } from 'react';
import CardsSide from './CardsSide.jsx';
import CardContentAdd from './CardContentAdd.jsx';
import '../styles/addcard.css';

export const AddCrd = () => {
  // Use default values for userId, cardSetId, and subsetId
  const userId = '672ca9b1572b8a9dad197f4c';
  const cardSetId = '64a1b2c3d4e5f60789012345';
  const subsetId = '64a1b2c3d4e5f60789012349';

  const [activeCard, setActiveCard] = useState(null);

  return (
    <div className="addcrd-container">
      <CardsSide
        setActiveCard={setActiveCard}
        userId={userId}
        cardSetId={cardSetId}
        subsetId={subsetId}
      />
      <CardContentAdd
        activeCard={activeCard}
        userId={userId}
        cardSetId={cardSetId}
        subsetId={subsetId}
      />
    </div>
  );
};

export default AddCrd;
