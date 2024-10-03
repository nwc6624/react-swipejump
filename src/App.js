import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GameOverPopup from './GameOverPopup';
import './Styles.css';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 150, y: 100 });
  const [isJumping, setIsJumping] = useState(false);
  const [steps, setSteps] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Use useMemo to create audio objects once, not on every render
  const jumpSound = useMemo(() => new Audio('/sounds/jump.wav'), []);
  const landSound = useMemo(() => new Audio('/sounds/land.wav'), []);
  const gameOverSound = useMemo(() => new Audio('/sounds/game-over.wav'), []);

  // Error handling for loading the audio files
  useEffect(() => {
    jumpSound.addEventListener('error', () => {
      console.error('Failed to load jump sound.');
    });
    landSound.addEventListener('error', () => {
      console.error('Failed to load land sound.');
    });
    gameOverSound.addEventListener('error', () => {
      console.error('Failed to load game over sound.');
    });

    // Cleanup event listeners when the component unmounts
    return () => {
      jumpSound.removeEventListener('error', () => {});
      landSound.removeEventListener('error', () => {});
      gameOverSound.removeEventListener('error', () => {});
    };
  }, [jumpSound, landSound, gameOverSound]);

  useEffect(() => {
    generateSteps();
  }, []);

  // Update highScore when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]); // Include highScore as a dependency

  // Gravity effect to simulate falling
  useEffect(() => {
    const gravityInterval = setInterval(() => {
      if (!isJumping && !gameOver) {
        setPlayerPosition((prevPos) => ({
          ...prevPos,
          y: Math.max(0, prevPos.y - 5), // Falling at a rate of 5 units
        }));
      }
    }, 50); // Update every 50ms to simulate gravity

    return () => clearInterval(gravityInterval);
  }, [isJumping, gameOver]);

  // Generate random steps
  const generateSteps = () => {
    const generatedSteps = [];
    for (let i = 0; i < 5; i++) {
      generatedSteps.push({
        x: Math.random() * 300, // Random horizontal position
        y: i * 100 + 100, // Vertical spacing between steps
      });
    }
    setSteps(generatedSteps);
  };

  const checkCollision = useCallback(() => {
    const currentStep = steps.find(
      (step) => playerPosition.y === step.y && Math.abs(playerPosition.x - step.x) <= 20
    );

    if (!currentStep) {
      gameOverSound.play();
      handleGameOver();
    } else {
      setScore((prevScore) => prevScore + 1);
      landSound.play();
    }
  }, [playerPosition, steps, gameOverSound, landSound]); // Include gameOverSound and landSound in dependencies

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

    jumpSound.play(); // Play jump sound
    setIsJumping(true);
    let jumpHeight = 100;
    let newY = playerPosition.y - jumpHeight;
    setPlayerPosition((prevPos) => ({ ...prevPos, y: newY }));

    setTimeout(() => {
      setPlayerPosition((prevPos) => ({ ...prevPos, y: newY + jumpHeight }));
      checkCollision();
      setIsJumping(false);
    }, 500);
  }, [playerPosition, isJumping, gameOver, checkCollision, jumpSound]); // Include jumpSound as a dependency

  const handleContainerClick = () => {
    handleJump(); // Call the jump function when the container is clicked
  };

  useEffect(() => {
    window.addEventListener('keydown', handleMovement);

    return () => {
      window.removeEventListener('keydown', handleMovement);
    };
  }, [handleMovement]);

  const handleGameOver = () => {
    setGameOver(true);
    setPlayerPosition((prevPos) => ({ ...prevPos, y: -100 })); // Player falls off the screen
  };

  const resetGame = () => {
    setScore(0);
    setPlayerPosition({ x: 150, y: 100 });
    generateSteps();
    setGameOver(false);
  };

  return (
    <div className="game-container" onClick={handleContainerClick}>
      <div className="score">Score: {score}</div>
      <div className="player" style={{ left: `${playerPosition.x}px`, bottom: `${playerPosition.y}px` }}></div>
      {steps.map((step, index) => (
        <div key={index} className="step" style={{ left: `${step.x}px`, bottom: `${step.y}px` }}></div>
      ))}
      {gameOver && <GameOverPopup onReset={resetGame} score={score} highScore={highScore} />}
    </div>
  );
}

export default App;

