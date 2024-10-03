import React from 'react';

const GameOverPopup = ({ onReset, score, highScore }) => {
  return (
    <div className="game-over">
      <h1>Game Over</h1>
      <p>Your Score: {score}</p>
      <p>High Score: {highScore}</p>
      <button onClick={onReset}>Try again?</button>
    </div>
  );
};

export default GameOverPopup;
