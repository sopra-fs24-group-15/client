import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {useNavigate} from "react-router-dom";
import { api } from "helpers/api";
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
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Meme */
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

  /* check if everyone submitted */
  useEffect(() => {
    if (voting === false) return; // Don't start checking if shouldCheck is false
    const intervalId = setInterval(async () => {
      const response1 = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/votes`);
      const response2 = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
      if (response1.data === response2.data.players.length) {
        // Do something
        clearInterval(intervalId); // Stop checking once the condition is true
        doTimeUp();
      }
    }, 1000); // Check for other users to finish
  });

  /* Time Up */
  const doTimeUp = async () => {
    navigate("/loading")
    const ownUser = Number(localStorage.getItem("ownUserId"))
    const responseIsOwner = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
    if (responseIsOwner.data.lobbyOwner === ownUser) {
      //end round as owner
      api.put(`lobbys/${localStorage.getItem("lobbyId")}/rounds/end`);
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
        <button className="home button_small left" onClick={() => doHome()}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        
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
            <img src={currentMeme.memeURL} alt="current Meme URL"></img>
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