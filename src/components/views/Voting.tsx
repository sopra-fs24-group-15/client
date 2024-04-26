import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Spinner } from "components/ui/Spinner";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Voting.scss";

// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import home from "../img/home.png";
//Rules
import { Rules } from "../ui/Rules";


const LobbyPlayer = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  // Captions
  const [previousMeme, setPreviousMeme] = useState<string>(null);
  const [nextMeme, setNextMeme] = useState<string>(null);
  // Disable submit button
  const [submitted, setSubmitted] = useState(false);

  /* Home Button */
  const doHome = async () => {
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Meme */
  let meme = "https://i.imgflip.com/22bdq6.jpg";
  const getMeme = async () => {
    //add logic to change names
  }
  
  // previous Meme
  const doPreviousMeme = async () => {
    //add logic to change names
  }

  //next Meme
  const doNextMeme = async () => {
    //add logic to change names
  }

  /* Submit Button */
  const doSubmit = async () => {
    setSubmitted(true);
    //TODO add submit
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
              onComplete={() => { doSubmit().then(() => {}); }}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>

          <div className="voting meme">
            <img src={meme}></img>
          </div>

        </div>
        <div className="button-container">
          <Button 
              className="voting button-container"
              width = "100%"
              onClick={() => doPreviousMeme()}
            >
              Previous Meme
            </Button>

            <Button
              className="voting button-container"
              width="100%"
              onClick={() => doSubmit()}
              disabled={submitted}
            >
              Submit
            </Button>

            <Button 
              className="voting button-container"
              width = "100%"
              onClick={() => doNextMeme()}
            >
              Next Meme
            </Button>
          </div>


      </div>
    </BaseContainer>
  );
};

export default LobbyPlayer;
