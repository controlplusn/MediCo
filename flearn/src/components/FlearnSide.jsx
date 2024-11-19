import React from 'react'
import {Icon} from '@iconify/react';

export const FlearnSide = () => {
  return (
    <div className="side--container">
    <div className="study--method">
        <h5>Study Method</h5>
        <button>Active Recall</button>
        <button>Pomodoro Technique</button>
        <button>Mnemonic</button>
        <button>Spaced-Repetition</button>
    </div>

    <div className="subsets--container">
        <div className="subsets--header">
        <h5>Subsets:</h5>
        <Icon icon="gridicons:add"/>
        </div>
        <button>Nervous System</button>
        <button>Digestive System</button>
        <button>Endocrine System</button>
        <button>Reproductive System</button>
    </div>
    </div>
  )
}

export default FlearnSide;
