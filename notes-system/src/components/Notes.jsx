import React from "react";
import { Icon } from '@iconify/react';
import '../assets/styles/notes.css';

const Note = ({ title, date, description }) => {
  return (
    <div className="note">
      <div className="note-header">
        <h5>{title}</h5>
        <Icon icon="oi:ellipses" className="icon-ellipses" />
      </div>
      <h6>{date} | {description}</h6>
    </div>
  );
}

const Notes = () => {
  return (
    <div className="notes-container">
      <div className="notes-header">
        <h5>All Notes</h5>
        <div className="icons">
          <Icon icon="carbon:add-filled" className="icon add-icon" />
          <Icon icon="iconamoon:mode-dark-light" className="icon theme-icon" />
        </div>
      </div>
      <div className="notes-list">
        <Note 
          title="Human body" 
          date="9/30/2019" 
          description="The physical substance of the human organism..." 
        />
        <hr />
        <Note 
          title="Intro to Physiology" 
          date="11/27/2019" 
          description="The study of physiology is, in a sense, the study..." 
        />
        <hr />
        <Note 
          title="Pharmacology" 
          date="2/15/2020" 
          description="A drug is a chemical agent which can affect..." 
        />
        <hr />
      </div>
    </div>
  );
}

export default Notes;
