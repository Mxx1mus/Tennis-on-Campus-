import React from 'react';
import './greeting.css';

function Greeting() {
  return (
    <div className = "greeting-container">
      <h2>Welcome to our Gym Cat Website!</h2>
      <p className = "greeting-description">
        Here at our website, you can browse recipes so you can become big and strong like all these cats!!!
      </p>
    </div>
  );
}

export default Greeting;
