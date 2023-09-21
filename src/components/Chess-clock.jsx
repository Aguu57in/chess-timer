import { useState, useEffect } from "react";
import "./chess-clock.css";
import Modal from "react-modal";
import Swal from "sweetalert2";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  const formatMins = minutes < 10 ? `0${minutes}` : minutes;
  const formatSecs = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
  return `${formatMins}:${formatSecs}`;
}

export const ChessClock = () => {
  const [blackTime, setBlackTime] = useState(900);
  const [whiteTime, setWhiteTime] = useState(900);
  const [activePlayer, setActivePlayer] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [initialTime, setInitialTime] = useState('900');
  const [increment, setIncrement] = useState('0');
  const [gameIsPaused, setGameIsPaused] = useState(false);
  const [gameIsStarted, setGameIsStarted] = useState(false);
  const [gameIsFinished, setGameIsFinished] = useState(false);

  useEffect(() => {
    let interval;

    if (!gameIsPaused) {
      if (activePlayer === 'black' && blackTime > 0) {
        interval = setInterval(() => {
          setBlackTime((prevTime) => prevTime - 1);
        }, 1000);
      } else if (activePlayer === 'white' && whiteTime > 0) {
        interval = setInterval(() => {
          setWhiteTime((prevTime) => prevTime - 1);
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [activePlayer, blackTime, whiteTime, gameIsPaused]);



  const switchPlayer = () => {
    if (!gameIsPaused) {
      setActivePlayer((prevPlayer) => {
        if (!gameIsStarted) {
          setGameIsStarted(true);
          return prevPlayer === 'white' ? 'black' : 'white';
        }
        const inc = parseInt(increment, 10);
        const newTime = prevPlayer === 'black' ? blackTime : whiteTime;
        const updatedTime = newTime + inc;
        if (prevPlayer === 'black') {
          setBlackTime(updatedTime);
        } else {
          setWhiteTime(updatedTime);
        }
        return prevPlayer === 'black' ? 'white' : 'black';
      });
    }
  };

  const handleSpacebar = (e) => {
    if (e.key === ' ' && !modalIsOpen) {
      switchPlayer();
      e.preventDefault();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleSpacebar);
    return () => {
      window.removeEventListener('keydown', handleSpacebar);
    };
  }, [handleSpacebar]);

  const togglePause = () => {
    setGameIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const timeAlert = (secs) => {
    return secs <= 60;
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  }; 

  const resetClock = () => {
    setBlackTime(parseInt(initialTime));
    setWhiteTime(parseInt(initialTime));
    setActivePlayer(null);
    setGameIsPaused(false);
    setModalIsOpen(false);
    setGameIsStarted(false);
    setGameIsFinished(false);
  };

  useEffect(() => {
    if (blackTime === 0 || whiteTime === 0) {
      setGameIsFinished(true);
      setGameIsPaused(true);
      const ganador = blackTime === 0 ? 'blancas' : 'negras';

      Swal.fire({
        color: "#272b35",
        background: "#b4bedd",
        title: `¡Ganan las ${ganador}!`,
        text: "Se acabó el tiempo",
        imageUrl: "https://cdn1.iconfinder.com/data/icons/creative-process-19/100/creative_process_strategy-512.png",
        imageWidth: 200,
        confirmButtonColor: "#444a59",
        backdrop: "#000000ab",
      });
      resetClock();
    }
  }, [blackTime, whiteTime]);
  

  return (
    <div>
     <div className="clocks">
      <div>
        <div onClick={switchPlayer}
          className={`player whites ${activePlayer === "white" ? null : "unable-white"}
           ${timeAlert(whiteTime) && activePlayer === "white" && !gameIsPaused ? "time-alert" : null}`}>
          <p>{formatTime(whiteTime)}</p>
        </div>
      </div>
      <div className="controls">
        <button className="btn" onClick={openModal}><img src="/custom.svg"/></button>
        <button className="btn pause-play-btn" onClick={togglePause}>{gameIsPaused ? 
          <img src="/play.svg" /> : <img src="/pause.svg" />}</button>
        <button className="btn reset-btn" onClick={resetClock}><img src="/reset.svg"/></button>
      </div>
        <div onClick={switchPlayer}
          className={`player blacks ${activePlayer === "black" ? null : "unable-black"}
          ${timeAlert(blackTime) && activePlayer === "black" && !gameIsPaused ? "time-alert" : null}`}>
          <p>{formatTime(blackTime)}</p>
        </div>
      </div>

      
       <Modal className="modal-wrapper" isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div className="modal">
       <h2>Modificar tiempo</h2>
        <label>
          <h4>Tiempo (en segundos): </h4>
          <input
          type="number"
          value={initialTime}
          onChange={(e) => setInitialTime(e.target.value)}
          />
        </label>

        <label>
          <h4>Incremento (en segundos): </h4>
          <input
          type="number"
          value={increment}
          onChange={(e) => setIncrement(e.target.value)}
          />
        </label>

        <div className="modal-buttons">
          <button className="apply" onClick={resetClock}>Aplicar</button>
          <button className="cancel" onClick={closeModal}>Cancelar</button>
        </div>
        </div>
      </Modal> 

    </div>
  );
}
