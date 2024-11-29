import React from 'react';
import { useParams } from 'react-router-dom';
import FlearnHeader from './FlearnHeader'; 
import FlearnContent from './FlearnContent';
import FlearnSide from './FlearnSide';
import '../../styles/flearn.css';


export const Flearn = () => {
    const { subsetId, categoryId } = useParams();


    return (
      <div>
          <FlearnHeader />
          <div style={{ display: 'flex', width: '100%' }}>
              <FlearnContent categoryId={categoryId} subsetId={subsetId} />
              <FlearnSide />
          </div>
      </div>
    );
};