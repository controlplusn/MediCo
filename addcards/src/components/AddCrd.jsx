import React from 'react'
import CardsSide from './CardsSide';
import CardContentAdd from './CardContentAdd';
import '../styles/addcard.css'

export const AddCrd = () => {
  return (
    <div className="addcrd-container">
        <CardsSide/>
        <CardContentAdd />
    </div>
  )
}

export default AddCrd;
