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
import { LeavePopUp } from "components/ui/LeavePopUp";

const Votingscreen = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [showLeavePopUp, setShowLeavePopUp] = useState(false);
  // Topic
  const [topic, setTopic] = useState("")
  // Captions
  const [memeData, setMemeData] = useState([]);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  // Disable submit button
  const [voting, setVoting] = useState(false);
  // RoundCounter
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);

  useEffect(() => {
    getMemes();
  }, []);

  
  /* Home Button */
  const handleLeave = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    console.log(ownUser);
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

  const checkRounds = async () => {
    const settings = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/settings`);
    setTotalRounds(settings.data.totalRounds);
    const round = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/rounds`);
    setCurrentRound(round.data);
  }
  checkRounds();


  /* Meme */
  const getMemes = async () => {
    try {
      const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/memes/${localStorage.getItem("ownUserId")}`);
      const data = response.data.map(item => ({
        ...item,
        memeURL: JSON.parse(item.memeURL).MemeURL
      }));
      const response2 = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/templates`);
      if (response2.data.topic !== null) {
        setTopic(response2.data.topic);
      }
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
  const currentMemeDisplayIndex = currentMemeIndex + 1;
  const totalMemes = memeData.length;
  console.log(currentMeme); 
  console.log(currentMeme.memeurl)
    
  return (
    <BaseContainer className="voting container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
        {showLeavePopUp && <LeavePopUp close={toggleLeavePopUp} leave={handleLeave} />}
      </div>
      <div className="voting content">
        <button className="home button_small left" onClick={toggleLeavePopUp}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        <h1 className = "voting roundCounter">Round {currentRound}/{totalRounds}</h1>
        {topic !== "" && <h2>TOPIC: {topic}</h2>}
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
            <div className="voting memeIndex">
              <p>{currentMemeDisplayIndex}/{totalMemes}</p>
            </div>
          </div>
        </div>
        <div className="voting button-container">
          <Button
            width = "25%"
            onClick={() => doPreviousMeme()}
          >
              Previous Meme
          </Button>

          <Button
            width="35%"
            onClick={() => doVoting()}
            disabled={voting}
          >
            Vote for this meme
          </Button>

          <Button 
            width = "25%"
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