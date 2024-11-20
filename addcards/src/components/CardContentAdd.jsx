import React from 'react';
import '../styles/cardcontentadd.css'

export const CardContentAdd = () => {
  return (
    <div className="cardcontentadd">
        <div className="cardquestion">
            <input type="text"/>
            <h5>Question</h5>
        </div>  
        <div className="cardanswer">
            <input type="text"/>
            <h5>Answer</h5>
        </div>
        <button>Add Flashcard</button>
    </div>
  )
}

export default CardContentAdd;
