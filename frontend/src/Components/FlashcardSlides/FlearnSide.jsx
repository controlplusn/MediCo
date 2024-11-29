import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export const FlearnSide = () => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isWorkSession, setIsWorkSession] = useState(true);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (isWorkSession) {
        setTimeLeft(breakTime * 60);
      } else {
        setTimeLeft(workTime * 60);
      }
      setIsWorkSession(!isWorkSession);
    }
  }, [timeLeft, isWorkSession, breakTime, workTime]);

  return (
    <div className="side--container">
      <div className="study--method">
        <h5>Pomodoro Timer</h5>
        <div className="timer-display">
          <h2>{isWorkSession ? 'Work Time' : 'Break Time'}</h2>
          <h1>{formatTime(timeLeft)}</h1>
        </div>
        <div className="controls">
          <button onClick={() => setIsTimerActive(!isTimerActive)}>
            {isTimerActive ? 'Pause Timer' : 'Start Timer'}
          </button>
          <button onClick={() => {
            setIsTimerActive(false);
            setTimeLeft(isWorkSession ? workTime * 60 : breakTime * 60);
          }}>
            Reset Timer
          </button>
        </div>
        <div className="settings">
          <label>
            Work Time (mins):
            <input
              type="number"
              value={workTime}
              onChange={(e) => setWorkTime(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isTimerActive}
            />
          </label>
          <label>
            Break Time (mins):
            <input
              type="number"
              value={breakTime}
              onChange={(e) => setBreakTime(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={isTimerActive}
            />
          </label>
        </div>
      </div>

    </div>
  );
};

export default FlearnSide;