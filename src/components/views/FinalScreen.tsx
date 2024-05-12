import "styles/views/FinalScreen.scss";
import BaseContainer from "components/ui/BaseContainer";
import React, { useState, useEffect} from "react";
import { Button } from "components/ui/Button";
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
import { LeavePopUp } from "components/ui/LeavePopUp";

const FinalScreen = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // scores
  const [scores, setScores] = useState([]);
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [showLeavePopUp, setShowLeavePopUp] = useState(false);
  const [winnerMeme, setWinnerMeme] = useState("https://img.com");
  /* Home Button */
  const handleLeave = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Leave Button */
  const toggleLeavePopUp = async () => {
    setShowLeavePopUp(!showLeavePopUp);
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  const doLobby = async () => {
    const ownUser = Number(localStorage.getItem("ownUserId"))
    const responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
    if (responseIsOwner.data.lobbyOwner === ownUser){
      navigate("/lobby/owner");
    } else {
      navigate("/lobby/player");
    }
  }

  /* Ranking */
  useEffect(() => {
    const fetchScores = async () => {
      console.log("test")
      const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/scores`);
      const sortedData = response.data.sort((a, b) => b.score - a.score);
      setScores(sortedData[0]);
      const responseMeme = await api.get(`users/${sortedData[0].userId}/memes`);
      setWinnerMeme(responseMeme.data.MemeURL);
    };

    fetchScores();
  }, []);

  return (
    <BaseContainer className="finalscreen container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
        {showLeavePopUp && <LeavePopUp close={() => setShowLeavePopUp(false)} leave={() => handleLeave()} />}
      </div>
      <div className="finalscreen content">
        <button className="home button_small left" onClick={toggleLeavePopUp}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>

        <h1 className="finalscreen title">WINNER</h1>
        <div className="finalscreen winner">
          <div className="finalscreen usernameBox">
            <h1 className="finalscreen username">{scores.username} | {scores.score}p</h1>
          </div>
          <img src={winnerMeme} alt="best meme of winner" className="finalscreen meme"></img>
          
        </div>
        <Button
          className="createMeme button-container"
          width="100%"
          onClick={() => doLobby()}
        >
        Back to Lobby
        </Button>
      </div>
    </BaseContainer>
  );
};

export default FinalScreen;