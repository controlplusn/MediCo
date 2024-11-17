import React from 'react'
import Community from './components/Community'
import './assets/styles/community.css';

export const App = () => {
  return (
    <div className="community-container">
      <Community username={"helloWorld"}/>
    </div>
  );
};

export default App;
