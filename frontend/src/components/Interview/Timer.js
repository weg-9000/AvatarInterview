import React, { useEffect } from "react";
import useTimer from "../../hooks/useTimer";

const Timer = ({ duration, onTimeUp, isActive }) => {
  const { time, startTimer, stopTimer, resetTimer } = useTimer(duration);

  useEffect(() => {
    if (isActive) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isActive]);

  useEffect(() => {
    if (time === 0 && isActive) {
      onTimeUp();
    }
  }, [time, isActive]);

  // 시간 포맷팅 (분:초)
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className={`timer ${time < 10 ? "timer-warning" : ""}`}>
      <div className="timer-display">{formatTime()}</div>
      <div className="timer-progress">
        <div
          className="timer-bar"
          style={{ width: `${(time / duration) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
