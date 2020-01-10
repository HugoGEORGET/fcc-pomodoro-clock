import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25min
  const [paused, setPaused] = useState(true);
  const [timerState, setTimerState] = useState("Session");

  useEffect(() => {
    function tick() {
      if (!paused) {
        setSecondsLeft(secondsLeft - 1);
      }
    }

    let intervalHandler = setInterval(tick, 1000);

    if (secondsLeft === 0) {
      document.getElementById("beep").play();

      if (timerState === "Break") {
        setTimerState("Session");
        setSecondsLeft(sessionLength * 60);
      } else {
        setTimerState("Break");
        setSecondsLeft(breakLength * 60);
      }
    }

    return () => {
      clearInterval(intervalHandler);
    };
  }, [paused, secondsLeft, timerState, breakLength, sessionLength]);

  function startTimer() {
    setPaused(false);
  }

  function pauseTimer() {
    setPaused(true);
  }

  function breakLengthUp() {
    setBreakLength(breakLength + 1);
    if (breakLength >= 60) {
      setBreakLength(60);
    }
  }

  function breakLengthDown() {
    setBreakLength(breakLength - 1);
    if (breakLength <= 1) {
      setBreakLength(1);
    }
  }

  function sessionLengthUp() {
    setSessionLength(sessionLength + 1);
    setSecondsLeft(secondsLeft + 60);
    if (sessionLength >= 60) {
      setSessionLength(60);
      setSecondsLeft(3600);
    }
  }

  function sessionLengthDown() {
    setSessionLength(sessionLength - 1);
    setSecondsLeft(secondsLeft - 60);
    if (sessionLength <= 1) {
      setSessionLength(1);
      setSecondsLeft(60);
    }
  }

  function parseSeconds(secondsLeft) {
    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft - minutes * 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  }

  function resetTimer() {
    setPaused(true);
    setTimerState("Session");
    setBreakLength(5);
    setSessionLength(25);
    setSecondsLeft(1500);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }

  return (
    <main>
      <section id="break-configuration">
        <h1 id="break-label">Break length</h1>
        <button id="break-decrement" onClick={() => breakLengthDown()}>
          ⬇
        </button>
        <output id="break-length">{breakLength}</output>
        <button id="break-increment" onClick={() => breakLengthUp()}>
          ⬆
        </button>
      </section>
      <section id="session-configuration">
        <h1 id="session-label">Session length</h1>
        <button id="session-decrement" onClick={() => sessionLengthDown()}>
          ⬇
        </button>
        <output id="session-length">{sessionLength}</output>
        <button id="session-increment" onClick={() => sessionLengthUp()}>
          ⬆
        </button>
      </section>
      <section id="timer">
        <h1 id="timer-label">{timerState}</h1>
        <span id="time-left">{parseSeconds(secondsLeft)}</span>
        <button id="start_stop" onClick={paused ? startTimer : pauseTimer}>
          <span role="img" aria-label="start-stop">
            ⏯
          </span>
        </button>
        <button id="reset" onClick={() => resetTimer()}>
          <span role="img" aria-label="reset">
            🔄
          </span>
        </button>
      </section>
      <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" />
    </main>
  );
}

export default App;
