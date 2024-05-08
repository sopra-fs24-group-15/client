import "styles/views/Scoreboard.scss";
import BaseContainer from "components/ui/BaseContainer";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import React, { useState, useEffect} from "react";
import { api } from "helpers/api";
import {useNavigate} from "react-router-dom";

// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import home from "../img/home.png";
//Rules
import { Rules } from "../ui/Rules";

const ScoreboardFinal = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // scores
  const [scores, setScores] = useState([]);
  // Rules
  const [showRules, setShowRules] = useState(false);
  //round played
  const roundPlayed = api.get(`/lobbys/${localStorage.getItem("lobbyId")}/rounds`);
  /* Home Button */
  const doHome = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Next Round */
  const doNextRound = async () => {
    const ownUser = Number(localStorage.getItem("ownUserId"))
    const responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
    if (responseIsOwner.data.lobbyOwner === ownUser) {
      api.post(`lobbys/${localStorage.getItem("lobbyId")}/rounds/start`);
    }
    checkNextRound();
  };

  /* new round funciton seperate not necesarly owner */
  const checkNextRound = async () => {
    navigate("/loading");
    const intervalId = setInterval(async () => {
      const newRound = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/rounds`);
      if (roundPlayed !== newRound) {
        clearInterval(intervalId);
        setTimeout(async () => {
          const ownUser = Number(localStorage.getItem("ownUserId"))
          const responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
          if (responseIsOwner.data.lobbyOwner === ownUser){
            const gameActive = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}`);
            if (!gameActive.data.gameActive) {
              navigate("/lobby/owner");
            } else {
              navigate("/createMeme");
            }
          } else {
            const gameActive = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}`);
            if (!gameActive.data.gameActive) {
              navigate("/lobby/player");
            } else {
              navigate("/createMeme");
            }
          }
        }, 3000);
      }
    }, 500); // Check every second
  
    return () => clearInterval(intervalId); // Return a function to stop checking
  };


  /* Ranking */
  useEffect(() => {
    const fetchScores = async () => {
      console.log("test")
      const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/scores`);
      console.log(response.data)
      const sortedData = response.data.sort((a, b) => b.score - a.score);
      setScores(sortedData);
    };

    fetchScores();
  }, []);

  /* Countdown Timer */
  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="scoreboard timerValue">0</div>;
    }

    return (
      <div className="scoreboard timer">
        <div className="scoreboard timerValue">{remainingTime}</div>
      </div>
    );
  };
    
  return (
    <BaseContainer className="scoreboard container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="scoreboard content">
        <button className="home button_small left" onClick={() => doHome()}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        <h1 className="scoreboard title">Ranking</h1>
        <div className="scoreboard rankingContainer">
          <div className="scoreboard timer-wrapper">
            <h1 className="scoreboard timerTitle">next round</h1>
            <CountdownCircleTimer
              isPlaying
              duration={10}
              strokeWidth={20}
              size={180}
              colors={["#adf7b6", "#fcf5c7", "#fce1e4"]}
              colorsTime={[10, 5, 0]}
              onComplete={() => { doNextRound().then(() => {}); }}
            >
              {renderTime}
            </CountdownCircleTimer>

          </div>
          <div className="ranking">
            {scores.map((user, index) => (
              <div key={index} className="scoreboard rankedUsers">
                <div>{index + 1}. {user.username}</div><div>{user.score} Points</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </BaseContainer>
  );
};

export default ScoreboardFinal;