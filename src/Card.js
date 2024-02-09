// Card.js
import React from 'react';
import './Card.css'; // Make sure to create a corresponding CSS file
import questionImage from './question.png'; 

const Card = ({ image, title, isRevealed }) => {
  const imageUrl = isRevealed ? image : questionImage;

  return (
    <div className="card">
      <h1>{title}</h1>
      <img src={imageUrl} alt={title} className="card-image" />
    </div>
  );
};

export default Card;
