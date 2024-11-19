import React, { useState, useEffect } from 'react';
import '../styles/flearn.css'

export const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Countdown starts from 25 minutes (in seconds)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      // Start the timer when isRunning is true
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Update every second
    } else if (timeLeft === 0) {
      // Timer has finished
      clearInterval(timer);
    }

    return () => clearInterval(timer); // Cleanup the interval when component unmounts or timer stops
  }, [isRunning, timeLeft]);

  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const startPomodoro = () => {
    setIsRunning(true);
  };

  const startBreak = () => {
    setTimeLeft(5 * 60); // 5-minute break time (in seconds)
    setIsRunning(true);
  };

  return (
    <div>
      <div>
        <p>{formatTime(timeLeft)}</p> {/* Display the countdown */}
      </div>
      <div>
        <button onClick={startPomodoro} disabled={isRunning}>Start</button>
        <button onClick={startBreak} disabled={isRunning}>Start Break</button>
      </div>
    </div>
  );
};

export default Pomodoro;