import React from 'react'
import ClassHeader from './ClassHeader.jsx';
import ClassContent  from './ClassContent.jsx';
import '../../styles/class.css';
export const Class = () => {
  return (
    <div className="class-container">
        <ClassHeader />
        <ClassContent />
    </div>
  )
}

export default Class;