import React from 'react';
import {Icon} from '@iconify/react';
import { Link } from 'react-router-dom';

export const FlearnHeader = ({ categoryId }) => {
  return (
    <div className="flearn--header">
        <div className="back-btn">

          <Link to={`/flashcardcontent/${categoryId}`}>
            <Icon icon="weui:back-outlined"/>
          </Link>
        <h6>Go back</h6>

      </div>
      <hr />
      <div className="flearn--header2">
      <h5>Flashcard</h5>
    </div>
    </div>
  );
};

export default FlearnHeader;