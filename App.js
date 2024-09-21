import React, { useState, useEffect } from 'react';
import './App.css';

function BreakControl({ breakLength, incrementBreak, decrementBreak }) {
  return (
    <div className="control-container">
      <h2 id="break-label">Break Length</h2>
      <div className="control-buttons">
        <button id="break-decrement" onClick={decrementBreak}>
          -
        </button>
        <span id="break-length">{breakLength}</span>
        <button id="break-increment" onClick={incrementBreak}>
          +
        </button>
      </div>
    </div>
  );
}

function SessionControl({ sessionLength, incrementSession, decrementSession }) {
  return (
    <div className="control-container">
      <h2 id="session-label">Session Length</h2>
      <div className="control-buttons">
        <button id="session-decrement" onClick={decrementSession}>
          -
        </button>
        <span id="session-length">{sessionLength}</span>
        <button id="session-increment" onClick={incrementSession}>
          +
        </button>
      </div>
    </div>
  );
}

function Timer({ timeLeft, isSession }) {
  return (
    <div className="timer-container">
      <h2 id="timer-label">{isSession ? 'Session' : 'Break'}</h2>
      <div id="time-left">{timeLeft}</div>
    </div>
  );
}

function ControlButtons({ startStop, reset }) {
  return (
    <div className="control-buttons-container">
      <button id="start_stop" onClick={startStop}>
        Start/Stop
      </button>
      <button id="reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500); // in seconds (25 * 60)
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  // Format time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Timer functionality with useEffect
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            setIsSession(!isSession);
            return isSession ? breakLength * 60 : sessionLength * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, isSession, breakLength, sessionLength]);

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(1500);
    setIsSession(true);
    setIsRunning(false);
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const incrementBreak = () => {
    if (breakLength < 60) setBreakLength(breakLength + 1);
  };

  const decrementBreak = () => {
    if (breakLength > 1) setBreakLength(breakLength - 1);
  };

  const incrementSession = () => {
    if (sessionLength < 60) setSessionLength(sessionLength + 1);
    if (!isRunning) setTimeLeft((sessionLength + 1) * 60);
  };

  const decrementSession = () => {
    if (sessionLength > 1) setSessionLength(sessionLength - 1);
    if (!isRunning) setTimeLeft((sessionLength - 1) * 60);
  };

  return (
    <div className="app-container">
      <BreakControl
        breakLength={breakLength}
        incrementBreak={incrementBreak}
        decrementBreak={decrementBreak}
      />
      <SessionControl
        sessionLength={sessionLength}
        incrementSession={incrementSession}
        decrementSession={decrementSession}
      />
      <Timer timeLeft={formatTime(timeLeft)} isSession={isSession} />
      <ControlButtons startStop={handleStartStop} reset={handleReset} />
      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav"></audio>
    </div>
  );
}

export default App;

