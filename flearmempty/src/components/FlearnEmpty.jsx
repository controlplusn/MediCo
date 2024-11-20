import React from 'react';
import { Icon } from '@iconify/react';
import '../styles/flearnempty.css';

export const FlearnEmpty = () => {
  return (
    <div className="flearnempty--container">
      <div className="flearn--header">
        <h5>Anatomy</h5>
        <button>
          All subsets <Icon icon="fe:arrow-down" />
        </button>
      </div>
      <div className="flearn--content">
        <img src="https://via.placeholder.com/100" alt="Anatomy graphic" />
        <button>
          Add <Icon icon="material-symbols-light:add" />
        </button>
      </div>
    </div>
  );
};

export default FlearnEmpty;
