import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GameOverPopup from './GameOverPopup';
import './Styles.css';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 150, y: 100 });
  const [isJumping, setIsJumping] = useState(false);
  const [onPlatform, setOnPlatform] = useState(false); // Track if the player is on a platform
  const [currentPlatform, setCurrentPlatform] = useState(null); // Track the platform the player is on
  const [steps, setSteps] = useState([]); // Green tiles (platforms)
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if the player has started jumping on platforms
  const [speed, setSpeed] = useState(5); // Platform speed

  // Use useMemo to create audio objects once, not on every render
  const jumpSound = useMemo(() => new Audio('/sounds/jump.wav'), []);
  const landSound = useMemo(() => new Audio('/sounds/land.wav'), []);
  const gameOverSound = useMemo(() => new Audio('/sounds/game-over.wav'), []);

  // Play sound only after user interaction
  const playSound = (sound) => {
    sound.play().catch((error) => {
      console.error('Audio play failed:', error);
    });
  };

  // Define handleGameOver before any useEffect or useCallback
  const handleGameOver = useCallback(() => {
    playSound(gameOverSound);
    setGameOver(true);
  }, [gameOverSound]);

  const checkCollision = useCallback(() => {
    const currentStep = steps.find(
      (step) =>
        playerPosition.y <= step.y + 20 && // Check vertical collision (player's bottom)
        playerPosition.y >= step.y - 20 && // Check vertical collision (player's top)
        Math.abs(playerPosition.x - step.x) <= step.width / 2 // Check horizontal collision based on platform width
    );

    if (currentStep) {
      // Player successfully landed on a platform
      setOnPlatform(true); // Ball is now on a platform
      setCurrentPlatform(currentStep); // Track the platform the player is on
      setPlayerPosition((prevPos) => ({ ...prevPos, y: currentStep.y })); // Set player's y position to platform's y

      // Only start increasing the score after the first platform is landed on
      if (!hasStarted) {
        setHasStarted(true);
      } else {
        setScore((prevScore) => prevScore + 1);
      }

      playSound(landSound);
    } else if (playerPosition.y <= 0) {
      handleGameOver(); // Player missed a platform or fell off the screen
    } else {
      setOnPlatform(false); // Ball is not on a platform
      setCurrentPlatform(null); // No platform under the ball
    }
  }, [playerPosition, steps, landSound, hasStarted, handleGameOver]);

  const handleJump = useCallback(() => {
    if (isJumping || gameOver) return;

    playSound(jumpSound); // Play jump sound after user interaction
    setIsJumping(true);
    setOnPlatform(false); // Reset platform state, ball is jumping now
    setCurrentPlatform(null); // Stop tracking platform since the ball is jumping
    let jumpHeight = 100;
    let newY = playerPosition.y + jumpHeight; // Move upwards by jumpHeight
    setPlayerPosition((prevPos) => ({ ...prevPos, y: newY }));

    setTimeout(() => {
      setPlayerPosition((prevPos) => ({ ...prevPos, y: newY - jumpHeight })); // Fall back after jump
      checkCollision(); // Check if player landed on a platform
      setIsJumping(false); // Allow gravity after jump completes
    }, 400); // Faster jump duration for more responsive gameplay
  }, [playerPosition, isJumping, gameOver, checkCollision, jumpSound]);

  const handleMovement = useCallback((e) => {
    if (gameOver) return;

    if (e.key === 'ArrowLeft') {
      setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x - 20 }));
    } else if (e.key === 'ArrowRight') {
      setPlayerPosition((prevPos) => ({ ...prevPos, x: prevPos.x + 20 }));
    } else if (e.key === ' ') {
      handleJump(); // Spacebar triggers jump
    }
  }, [gameOver, handleJump]);

  const handleContainerTap = useCallback(() => {
    handleJump(); // Tap or click triggers jump
  }, [handleJump]);

  // Generate initial falling steps (platforms)
  const generateSteps = () => {
    const generatedSteps = [];
    for (let i = 0; i < 3; i++) {
      generatedSteps.push({
        x: Math.random() * 300, // Random horizontal position
        y: 600 - i * 150, // Spaced vertically
        width: 50 + Math.random() * 50, // Randomize platform width
      });
    }
    setSteps(generatedSteps);
  };

  useEffect(() => {
    generateSteps(); // Create the first set of falling platforms
  }, []);

  // Gradually increase speed
  useEffect(() => {
    const speedInterval = setInterval(() => {
      setSpeed((prevSpeed) => Math.min(prevSpeed + 0.2, 10)); // Faster speed increase for more dynamic gameplay
    }, 1500); // Faster speed increase every 1.5 seconds

    return () => clearInterval(speedInterval);
  }, []);

  // Update highScore when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  // Falling platforms and moving the player with the platform
  useEffect(() => {
    const stepInterval = setInterval(() => {
      if (!gameOver) {
        setSteps((prevSteps) =>
          prevSteps.map((step) => ({
            ...step,
            y: step.y - speed, // Move tiles down at the current speed
          }))
        );

        // If the player is on a platform, move the player along with the platform
        if (onPlatform && currentPlatform) {
          setPlayerPosition((prevPos) => ({
            ...prevPos,
            y: currentPlatform.y - speed,
          }));
        }

        // Remove tiles that are off the screen
        setSteps((prevSteps) => prevSteps.filter((step) => step.y > 0));

        // Add new step at the top
        if (Math.random() > 0.9) {
          const newStep = {
            x: Math.random() * 300,
            y: 600,
            width: 50 + Math.random() * 50, // Randomize platform width between 50 and 100px
          };
          setSteps((prevSteps) => [...prevSteps, newStep]);
        }
      }
    }, 50); // Faster platform update interval for smoother rendering

    return () => clearInterval(stepInterval);
  }, [gameOver, speed, onPlatform, currentPlatform]);

  // Gravity effect to simulate falling, but only when not jumping or on platform
  useEffect(() => {
    const gravityInterval = setInterval(() => {
      if (!isJumping && !onPlatform && !gameOver) {
        setPlayerPosition((prevPos) => ({
          ...prevPos,
          y: Math.max(0, prevPos.y - 7), // Faster gravity pull for more dynamic gameplay
        }));
        if (playerPosition.y <= 0) {
          handleGameOver(); // Trigger game over if the player falls off the screen
        }
      }
    }, 30); // Faster gravity interval for smoother falling

    return () => clearInterval(gravityInterval);
  }, [isJumping, onPlatform, gameOver, playerPosition, handleGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleMovement);
    window.addEventListener('touchstart', handleContainerTap); // Listen for taps on mobile

    return () => {
      window.removeEventListener('keydown', handleMovement);
      window.removeEventListener('touchstart', handleContainerTap);
    };
  }, [handleMovement, handleContainerTap]);

  const resetGame = () => {
    setScore(0);
    setHasStarted(false); // Reset the game start condition
    setPlayerPosition({ x: 150, y: 100 });
    setCurrentPlatform(null); // Reset platform tracking
    generateSteps(); // Regenerate platforms
    setSpeed(5); // Reset speed to the initial value
    setGameOver(false); // Reset game over state
  };

  return (
    <div className="game-container" onClick={handleContainerTap}>
      <div className="score">Score: {score}</div>
      <div className="player" style={{ left: `${playerPosition.x}px`, bottom: `${playerPosition.y}px` }}></div>
      {steps.map((step, index) => (
        <div
          key={index}
          className="step"
          style={{ left: `${step.x}px`, bottom: `${step.y}px`, width: `${step.width}px` }}
        ></div>
      ))}
      {gameOver && <GameOverPopup onReset={resetGame} score={score} highScore={highScore} />}
    </div>
  );
}

export default App;
