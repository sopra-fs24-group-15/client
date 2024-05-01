import React, { useState, useEffect} from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Spinner } from "components/ui/Spinner";
import { api, handleError } from "helpers/api";
import {json, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/CreateMeme.scss";

// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import home from "../img/home.png";
//Rules
import { Rules } from "../ui/Rules";

const FormField1 = (props) => {
  return (
    <div className="createMeme field">
      <input
        className="createMeme input"
        placeholder="Write your caption here"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
FormField1.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const FormField2 = (props) => {
  return (
    <div className="createMeme field">
      <input
        className="createMeme input"
        placeholder="Write your caption here"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField2.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const LobbyPlayer = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // meme
  const [meme, setMeme] = useState("https://i.imgflip.com/22bdq6.jpg");
  const [memeId, setMemeId] = useState(1);
  // Rules
  const [showRules, setShowRules] = useState(false);
  // Captions
  const [topCaption, setTopCaption] = useState<string>(" ");
  const [bottomCaption, setBottomCaption] = useState<string>(" ");
  // Disable submit button
  const [submitted, setSubmitted] = useState(false);

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

  /* Meme */
  const getMeme = async () => {
    const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/templates`);
    console.log(response.data)
    setMeme(response.data.url);
    setMemeId(response.data.templateId)
  };
  useEffect(() => {
    getMeme();
  }, []);

  /* Time Up*/
  const doTimeUp = async () => {
    await doSubmit();
    navigate("/voting")
  }

  /* Submit Button */
  const doSubmit = async () => {
    const ownUser = Number(localStorage.getItem("ownUserId"))
    setSubmitted(true);
    let text0 = topCaption.replace(/ /g, "%20");
    let text1 = bottomCaption.replace(/ /g, "%20");
    const username = "MemeBattleFrontend"
    const password = "dysryw-Nepjen-6gudha"
    const imgflip = await fetch(`https://api.imgflip.com/caption_image?template_id=${memeId}&username=${username}&password=${password}&text0=${text0}&text1=${text1}`)
    const data = await imgflip.json();
    const urlOnly = { MemeURL: data.data.url };
    setMeme(urlOnly.MemeURL, urlOnly)
    //TODO reactivate send to Server!
    //const sendToServer = await api.post(`lobbys/${localStorage.getItem("lobbyId")}/memes/${ownUser}`, urlOnly);
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="createMeme timerValue">0</div>;
    }

    return (
      <div className="createMeme timer">
        <div className="createMeme timerValue">{remainingTime}</div>
      </div>
    );
  };
    
  return (
    <BaseContainer className="createMeme container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="createMeme content">
        <img src={home} draggable="false" alt="Back" className="lobby logo_small left" onClick={() => doHome()}/>
        <img src={logo} draggable="false" alt="Logo" className="lobby logo_small middle"/>
        <img src={rules} draggable="false" alt="Rules" className="lobby logo_small right" onClick={() => doRule()}/>
        {!submitted && (
          <FormField1
            value={topCaption}
            onChange={(n) => setTopCaption(n)}
          />
        )}

        <div className="createMeme memeContainer">
          
          <div className="CreateMeme timer-wrapper">
            <h1 className="createMeme timerTitle">countdown</h1>
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

          <div className="createMeme meme">
            <img src={meme}></img>
          </div>

          <Button
            className="createMeme button-container"
            width="100%"
            onClick={() => doSubmit()}
            disabled={submitted === true}
          >
            Submit
          </Button>

        </div>

        {!submitted && (
          <FormField1
            value={bottomCaption}
            onChange={(n) => setBottomCaption(n)}
          />
        )}
      </div>
    </BaseContainer>
  );
};

export default LobbyPlayer;
