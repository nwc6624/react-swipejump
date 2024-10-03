import React, { useState, useEffect } from 'react';
import GameOverPopup from './GameOverPopup';
import './Styles.css';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [steps, setSteps] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateSteps();
    window.addEventListener('keydown', handleMovement);
    window.addEventListener('touchstart', handleJump);

    return () => {
      window.removeEventListener('keydown', handleMovement);
      window.removeEventListener('touchstart', handleJump);
    };
  }, []);

  const generateSteps = () => {
    const generatedSteps = [];
    setSteps(generatedSteps);
  };

  const handleMovement = (e) => {
    if (gameOver) return;
    
    if (e.key === 'ArrowLeft') {
      setPlayerPosition({ ...playerPosition, x: playerPosition.x - 20 });
    } else if (e.key === 'ArrowRight') {
      setPlayerPosition({ ...playerPosition, x: playerPosition.x + 20 });
    }
  };

  const handleJump = () => {
    if (isJumping || gameOver) return;
    
    setIsJumping(true);
    let jumpHeight = 100;
    let newY = playerPosition.y - jumpHeight;
    setPlayerPosition({ ...playerPosition, y: newY });

    setTimeout(() => {
      setPlayerPosition({ ...playerPosition, y: newY + jumpHeight });
      checkCollision();
      setIsJumping(false);
    }, 500);
  };

  const checkCollision = () => {
    if (/* missed a step */) {
      setGameOver(true);
    } else {
      setScore(score + 1);
    }
  };

  const resetGame = () => {
    setScore(0);
    setPlayerPosition({ x: 0, y: 0 });
    generateSteps();
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="score">Score: {score}</div>
      <div className="player" style={{ left: playerPosition.x, bottom: playerPosition.y }}></div>
      {steps.map((step, index) => (
        <div key={index} className="step" style={{ left: step.x, bottom: step.y }}></div>
      ))}
      {gameOver && <GameOverPopup onReset={resetGame} />}
    </div>
  );
}

export default App;
