import React from "react";
import Notes from "./Notes"; 
import ContentNotes from "./ContentNotes"; 
import "../assets/styles/notessystem.css";
import "../assets/styles/contentnotes.css"; 

const NotesSystem = () => {
  return (
    <div className="notes-system">
      <Notes />
      <ContentNotes />
    </div>
  );
}

export default NotesSystem;
