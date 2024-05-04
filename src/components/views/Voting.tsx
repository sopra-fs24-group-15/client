import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Spinner } from "components/ui/Spinner";
import {useNavigate} from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Voting.scss";

// @ts-ignore
import logo from "../img/logo.png"
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import home from "../img/home.png";
//Rules
import { Rules } from "../ui/Rules";
import { isConstructorDeclaration } from "typescript";


const Votingscreen = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  // Captions
  const [memeData, setMemeData] = useState([]);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  // Disable submit button
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    getMemes();
  }, []);

  /* Home Button */
  const doHome = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    console.log(ownUser);
    const removeUser = await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Meme */
  let meme = "https://i.imgflip.com/22bdq6.jpg";
  const getMemes = async () => {
    try {
      const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/memes/${localStorage.getItem("ownUserId")}`);
      const data = response.data.map(item => ({
        ...item,
        memeURL: JSON.parse(item.memeURL).MemeURL
      }));
      console.log(data);
      setMemeData(data);
    } catch (error) {
      console.error("Error while fetching memes: ", error);
    }
  };
  
  // previous Meme
  const doPreviousMeme = async () => {
    setCurrentMemeIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex -1 : memeData.length - 1);
  };

  //next Meme
  const doNextMeme = async () => {
    setCurrentMemeIndex((prevIndex) =>
      prevIndex < memeData.length - 1 ? prevIndex + 1 : 0);
  };

  /* Time Up */
  const doTimeUp = async () => {
    navigate("/loading")
    await doVoting();
    const ownUser = Number(localStorage.getItem("ownUserId"))
    const responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
    if (responseIsOwner.data.lobbyOwner === ownUser) {
      //end round as owner
      const res = api.put(`lobbys/${localStorage.getItem("lobbyId")}/rounds/end`);
    }
    setTimeout(() => {
      navigate("/scoreboard");
    }, 3000);
  };

  /* Submit Button */
  const doVoting = async () => {
    if (voting === false) {
      setVoting(true);
      //TODO add submit
      const requestBody = JSON.stringify(currentMeme.userId);
      console.log(requestBody);
      await api.post(`/lobbys/${localStorage.getItem("lobbyId")}/votes`, requestBody);
    }
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="voting timerValue">0</div>;
    }

    return (
      <div className="voting timer">
        <div className="voting timerValue">{remainingTime}</div>
      </div>
    );
  };

  const currentMeme = memeData[currentMemeIndex] || "";
  console.log(currentMeme); 
  console.log(currentMeme.memeurl)
    
  return (
    <BaseContainer className="voting container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="voting content">
        <img src={home} draggable="false" alt="Back" className="lobby logo_small left" onClick={() => doHome()}/>
        <img src={logo} draggable="false" alt="Logo" className="lobby logo_small middle"/>
        <img src={rules} draggable="false" alt="Rules" className="lobby logo_small right" onClick={() => doRule()}/>
        
        <div className="voting memeContainer">
          
          <div className="voting timer-wrapper">
            <h1 className="voting timerTitle">countdown</h1>
            <CountdownCircleTimer
              isPlaying
              duration={60}
              strokeWidth={20}
              size={180}
              colors={["#adf7b6", "#fcf5c7", "#fce1e4"]}
              colorsTime={[60, 30, 0]}
              onComplete={() => { doTimeUp().then(() => {}); }}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>

          <div className="voting meme">
            <img src={currentMeme.memeURL}></img>
          </div>

        </div>
        <div className="voting button-container">
          <Button 
            width = "30%"
            onClick={() => doPreviousMeme()}
          >
              Previous Meme
          </Button>

          <Button
            width="30%"
            onClick={() => doVoting()}
            disabled={voting}
          >
            Vote for this meme
          </Button>

          <Button 
            width = "30%"
            onClick={() => doNextMeme()}
          >
            Next Meme
          </Button>
        </div>


      </div>
    </BaseContainer>
  );
};


export default Votingscreen;