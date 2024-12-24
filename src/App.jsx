import React, { useState, useRef } from "react";
import Maze from "./Maze";
import "./App.css";
import bgMusic from "./bg.mp3";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [rows, setRows] = useState(15); // Default rows for medium
  const [cols, setCols] = useState(15); // Default cols for medium
  const [volume, setVolume] = useState(0.5); // Default volume
  const audioRef = useRef(null);

  // Initialize audio
  if (!audioRef.current) {
    audioRef.current = new Audio(bgMusic);
    audioRef.current.loop = true; // Ensure looping
  }

  const startGame = () => {
    setGameStarted(true);
    audioRef.current.volume = volume;
    audioRef.current.play();
  };

  const backToHome = () => {
    setGameStarted(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0; // Reset audio
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleDifficultyChange = (event) => {
    const newDifficulty = event.target.value;
    setDifficulty(newDifficulty);
    if (newDifficulty === "easy") {
      setRows(10);
      setCols(10);
    } else if (newDifficulty === "medium") {
      setRows(15);
      setCols(15);
    } else if (newDifficulty === "hard") {
      setRows(20);
      setCols(20);
    }
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <div className="menu">
          <h1>Maze Runner</h1>
          <button onClick={startGame}>Start Game</button>
          <div className="options">
            <h2>Options</h2>
            <div className="option">
              <label htmlFor="volume">Background Music Volume:</label>
              <input
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
            <div className="option">
              <label htmlFor="difficulty">Difficulty:</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <button className="back-button" onClick={backToHome}>
            Back to Home
          </button>
          <Maze rows={rows} cols={cols} />
        </div>
      )}
    </div>
  );
};

export default App;