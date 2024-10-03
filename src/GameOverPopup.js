import React from 'react';

const GameOverPopup = ({ onReset }) => {
  return (
    <div className="game-over">
      <h1>Game Over</h1>
      <button onClick={onReset}>Try again?</button>
    </div>
  );
};

export default GameOverPopup;
