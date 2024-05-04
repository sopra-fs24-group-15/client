import "styles/views/Scoreboard.scss";
import BaseContainer from "components/ui/BaseContainer";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import React, { useState, useEffect} from "react";
import { api, handleError } from "helpers/api";
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
  /* Home Button */
  const doHome = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    const removeUser = await api.delete(`/users/${ownUser}`);
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
      // TODO check if another round should be played. start if yes lobby if not.
      const gameActive = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}`);
      if (!gameActive.data.gameActive) {
        navigate("/lobby/owner")
      } else {
        //start next round
        await api.post(`lobbys/${localStorage.getItem("lobbyId")}/rounds/start`);
        navigate("/createMeme")
      }
      /* OLD VERSION OF CHECK OWNER
      const currentRound = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/rounds`);
      const temp = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/settings`)
      const totalRounds = Number(temp.data.totalRounds)
      if (totalRounds > currentRound.data) {
        //start next round
        await api.post(`lobbys/${localStorage.getItem("lobbyId")}/rounds/start`);
        navigate("/createMeme")
      } else {
        //go back to lobby
        navigate("/lobby/owner")
      }
      */
    } else { 
      const gameActive = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}`);
      if (!gameActive.data.gameActive) {
        navigate("/lobby/player")
      } else {
        //Join with a short break for owner to start.
        setTimeout(() => {
          navigate("/createMeme")
        }, 2000); // Wait for 2 seconds
      }
      /* OLD VERSION OF CHECK PLAYER
      const currentRound = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/rounds`);
      const temp = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/settings`)
      const totalRounds = Number(temp.data.totalRounds)
      if (totalRounds > currentRound.data) {
        console.log(currentRound.data)
        console.log(totalRounds)
        console.log(totalRounds > currentRound.data)
        //TODO wait for owner to start next round
        navigate("/createMeme")
      } else {
        // game finished, go back to lobby
        navigate("/lobby/player")
      } */
    }
  };

  /* Ranking */
  useEffect(() => {
    const fetchScores = async () => {
      const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/ranks`);
      const sortedData = response.data.sort((a, b) => b.score - a.score);
      setScores(sortedData);
      console.log(response.data);
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
        <img src={home} draggable="false" alt="Back" className="lobby logo_small left" onClick={() => doHome()}/>
        <img src={logo} draggable="false" alt="Logo" className="lobby logo_small middle"/>
        <img src={rules} draggable="false" alt="Rules" className="lobby logo_small right" onClick={() => doRule()}/>
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