import React, { useEffect, useState } from "react";
import bgMusic from "./bg.mp3";

const directions = [
  [-1, 0], // North
  [0, 1],  // East
  [1, 0],  // South
  [0, -1], // West
];
const wallIndexes = {
  "-1,0": 0, // North
  "0,1": 1,  // East
  "1,0": 2,  // South
  "0,-1": 3, // West
};

const generateWilsonMaze = (rows, cols) => {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      inMaze: false,
      walls: [true, true, true, true], // Walls: [N, E, S, W]
    }))
  );

  const removeWall = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const wallIndex = wallIndexes[`${dx},${dy}`];
    grid[x1][y1].walls[wallIndex] = false;
    grid[x2][y2].walls[(wallIndex + 2) % 4] = false; // Opposite wall
  };

  const loopErasedRandomWalk = (startX, startY) => {
    let path = [[startX, startY]];
    const visited = new Set([`${startX},${startY}`]);

    while (!grid[startX][startY].inMaze) {
      const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
      const nx = startX + dx;
      const ny = startY + dy;

      if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
        const currentCell = `${nx},${ny}`;

        const loopStartIndex = path.findIndex(
          ([px, py]) => `${px},${py}` === currentCell
        );
        if (loopStartIndex !== -1) {
          path = path.slice(0, loopStartIndex + 1);
        } else {
          path.push([nx, ny]);
          visited.add(currentCell);
        }

        startX = nx;
        startY = ny;
      }
    }

    return path;
  };

  grid[0][0].inMaze = true;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (!grid[x][y].inMaze) {
        const path = loopErasedRandomWalk(x, y);

        for (let i = 0; i < path.length - 1; i++) {
          const [x1, y1] = path[i];
          const [x2, y2] = path[i + 1];
          removeWall(x1, y1, x2, y2);
          grid[x2][y2].inMaze = true;
        }
      }
    }
  }

  return grid;
};

const Maze = ({ rows = 10, cols = 10 }) => {
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [goalPos, setGoalPos] = useState([rows - 1, cols - 1]);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const newGrid = generateWilsonMaze(rows, cols);
    setGrid(newGrid);
    setPlayerPos([0, 0]);
    setGoalPos([rows - 1, cols - 1]);
    setTimeLeft(Math.max(60 - (level - 1) * 5, 10));
    setTimerRunning(false);
    setGameOver(false);
    setWin(false);
  }, [rows, cols, level]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0 && !win && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timerRunning, timeLeft, win, gameOver]);

  const movePlayer = (dx, dy) => {
    const [x, y] = playerPos;
    const newX = x + dx;
    const newY = y + dy;

    if (
      newX >= 0 &&
      newX < rows &&
      newY >= 0 &&
      newY < cols &&
      !grid[x][y].walls[wallIndexes[`${dx},${dy}`]]
    ) {
      setPlayerPos([newX, newY]);

      if (newX === goalPos[0] && newY === goalPos[1]) {
        setWin(true);
        setTimerRunning(false);
      }
    }
  };

  const handleButtonClick = (direction) => {
    if (!gameOver && !win) {
      if (!timerRunning) setTimerRunning(true);

      switch (direction) {
        case "up":
          movePlayer(-1, 0);
          break;
        case "down":
          movePlayer(1, 0);
          break;
        case "left":
          movePlayer(0, -1);
          break;
        case "right":
          movePlayer(0, 1);
          break;
        default:
          break;
      }
    }
  };

  const handleKeyPress = (e) => {
    if (!timerRunning) setTimerRunning(true);

    switch (e.key) {
      case "ArrowUp":
      case "w":
        handleButtonClick("up");
        break;
      case "ArrowDown":
      case "s":
        handleButtonClick("down");
        break;
      case "ArrowLeft":
      case "a":
        handleButtonClick("left");
        break;
      case "ArrowRight":
      case "d":
        handleButtonClick("right");
        break;
      default:
        break;
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
    setTimerRunning(false);
    setScore(score + timeLeft);
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setPlayerPos([0, 0]);
    setTimeLeft(60);
    setTimerRunning(false);
    setGameOver(false);
    setWin(false);
    const newGrid = generateWilsonMaze(rows, cols);
    setGrid(newGrid);
  };

  const retryLevel = () => {
    setScore(score);
    setLevel(level);
    setPlayerPos([0, 0]);
    setTimeLeft(timeLeft);
    setTimeLeft(60);
    setTimerRunning(false);
    setGameOver(false);
    setWin(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPos, timerRunning]);

  return (
    <>
      <div className="maze-container">
        <div id="right">
        <h1>Maze Runner</h1>
        <p className="info">Level: {level}</p>
        <p>Score: {score}</p>
        <p className="info">Time Left: {timeLeft}s</p>
        <p style={{color : '#ffaa00',fontFamily : 'monospace,monospace'}}>Tip: You can use wasd/arrow keys to move as well</p>
        <div className="status">
          {win && (
            <p>
              Congratulations!{" "}
              <button onClick={nextLevel}>Next Level</button>
            </p>
          )}
          {gameOver && (
            <>
              <p>Game Over!</p>
              <button onClick={resetGame}>Restart</button>
            </>
          )}
        </div>

        </div>

        <div
          className="maze"
          style={{
            gridTemplateColumns: `repeat(${cols}, 40px)`,
            gridTemplateRows: `repeat(${rows}, 40px)`,
          }}
        >
          {grid.map((row, x) =>
            row.map((cell, y) => (
              <div key={`${x}-${y}`} className="cell">
                {cell.walls[0] && <div className="wall wall-north"></div>}
                {cell.walls[1] && <div className="wall wall-east"></div>}
                {cell.walls[2] && <div className="wall wall-south"></div>}
                {cell.walls[3] && <div className="wall wall-west"></div>}
                {playerPos[0] === x && playerPos[1] === y && (
                  <div className="player"></div>
                )}
                {goalPos[0] === x && goalPos[1] === y && (
                  <div className="goal"></div>
                )}
              </div>
            ))
          )}
        </div>

        <span className="controls" id="left">
            <div className="controls-up-down">
                <button onClick={() => handleButtonClick("up")}>Up</button>
            </div>
            <div className="controls-left-right">
                <button onClick={() => handleButtonClick("left")}>Left</button>
                <button onClick={() => handleButtonClick("right")}>Right</button>
            </div>
            <div className="controls-up-down">
                <button onClick={() => handleButtonClick("down")}>Down</button>
            </div>
        </span>
      </div>
    </>
  );
};

export default Maze;
