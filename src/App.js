import React, { useState, useEffect, useCallback } from 'react';
import GameOverPopup from './GameOverPopup';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [steps, setSteps] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    generateSteps();
  }, []);

  const generateSteps = () => {
    const generatedSteps = [
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 300, y: 300 },
    ];
    setSteps(generatedSteps);
  };

  const checkCollision = useCallback(() => {
    const currentStep = steps.find(
      (step) => playerPosition.y === step.y && Math.abs(playerPosition.x - step.x) <= 20
    );

    if (!currentStep) {
      setGameOver(true);
    } else {
      setScore((prevScore) => prevScore + 1);
    }
  }, [playerPosition, steps]);

  const handleMovement = useCallback((e) => {
    if (gameOver) return;

    if (e.key === 'ArrowLeft') {
      setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x - 20 }));
    } else if (e.key === 'ArrowRight') {
      setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x + 20 }));
    }
  }, [gameOver]);

  const handleJump = useCallback(() => {
    if (isJumping || gameOver) return;

    setIsJumping(true);
    let jumpHeight = 100;
    let newY = playerPosition.y - jumpHeight;
    setPlayerPosition((prevPos) => ({ ...prevPos, y: newY }));

    setTimeout(() => {
      setPlayerPosition((prevPos) => ({ ...prevPos, y: newY + jumpHeight }));
      checkCollision(); // Safely call the memoized checkCollision
      setIsJumping(false);
    }, 500);
  }, [playerPosition, isJumping, gameOver, checkCollision]);

  useEffect(() => {
    window.addEventListener('keydown', handleMovement);
    window.addEventListener('touchstart', handleJump);

    return () => {
      window.removeEventListener('keydown', handleMovement);
      window.removeEventListener('touchstart', handleJump);
    };
  }, [handleMovement, handleJump]);

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

