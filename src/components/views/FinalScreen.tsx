import "styles/views/FinalScreen.scss";
import BaseContainer from "components/ui/BaseContainer";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import User from "models/User";
import Lobby from "models/Lobby";
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
  // join again
  const [joincode, setJoincode] = useState("");
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
    let responseIsOwner;
    try {
      responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
    } catch (err) {
      navigate("/home");
      localStorage.clear();
      
      return
    }
    if (responseIsOwner.data.lobbyOwner === ownUser){
      navigate("/lobby/owner");
    } else {
      navigate("/loading");
      setTimeout(async () => {
        localStorage.removeItem("ownUserId");
        const requestBody = JSON.stringify({username: localStorage.getItem("username"), isOwner: false});
        console.log("Request to create user: " , requestBody);
        try{
          const createUserResponse = await api.post("/users", requestBody);
          const user = new User(createUserResponse.data);
          localStorage.setItem("ownUserId", user.userId);
          console.log("Server response: ", createUserResponse.data);
          const requestBody2 = JSON.stringify({lobbyJoinCode: joincode});
          console.log(requestBody2);
          try {
            const createLobbyResponse = await api.put(`/lobbys/${user.userId}`, requestBody2);
            console.log(createLobbyResponse.data);
            const lobby = new Lobby(createLobbyResponse.data);
            localStorage.setItem("lobbyId", lobby.lobbyId);
            navigate("/lobby/player");
          } catch (err) {
            const ownUser = localStorage.getItem("ownUserId");
            localStorage.removeItem("ownUserId");
            await api.delete(`/users/${ownUser}`);
            navigate("/home");
          }
        }
        catch (err) {
          navigate("/home");
        }
      }, 2000);  
    };
  }

  /* Ranking */
  useEffect(() => {
    const fetchScores = async () => {
      console.log("test")
      try {
        const responseMeme = await api.get(`users/${localStorage.getItem("firstPlaceId")}/memes`);
        setWinnerMeme(responseMeme.data.MemeURL);
        console.log(responseMeme)
        
        /* Check if owner, leave if not*/
        
        setTimeout(async () => {
          const ownUser = Number(localStorage.getItem("ownUserId"))
          const responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
          setJoincode(responseIsOwner.data.lobbyJoinCode);
          if (responseIsOwner.data.lobbyOwner !== ownUser){
            const ownUser = localStorage.getItem("ownUserId");
            await api.delete(`/users/${ownUser}`);
          }
        }, 2000);
      } catch (err) {
        console.log(err)
      }
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
            <h1 className="finalscreen username">{localStorage.getItem("firstPlaceName")} | {localStorage.getItem("firstPlaceScores")}p</h1>
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