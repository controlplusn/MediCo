import React from 'react';
import {Icon} from '@iconify/react';

export const FlearnHeader = () => {
  return (
    <div className="flearn--header">
        <div className="back-btn">
          <Icon icon="weui:back-outlined"/>
        <h6>Go back</h6>
      </div>
      <div className="flearn--header2">
      <h5>Flashcard</h5>
    </div>
    </div>
  );
};

export default FlearnHeader;