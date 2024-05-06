import React, { useState, useEffect} from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { api } from "helpers/api";
import { useNavigate} from "react-router-dom";
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
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Meme */
  const getMeme = async () => {
    const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/templates`);
    setMeme(response.data.url);
    setMemeId(response.data.templateId)
  };
  useEffect(() => {
    getMeme();
  }, []);

  /* return to lobby if game is inactive*/
  useEffect(() => {
    const checkStatus = async () => {
      const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
      if (!response.data.gameActive) {
        navigate("/lobby/player");
        console.log(checkStatus)
      }
    };
  })

  /* check if everyone submitted */
  useEffect(() => {
    if (!submitted) return; // Don't start checking if shouldCheck is false
    const intervalId = setInterval(async () => {
      const response1 = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/memes/0`);
      const response2 = await api.get(`lobbys/${localStorage.getItem("lobbyId")}`);
      if (response1.data.length === response2.data.players.length) {
        // Do something
        clearInterval(intervalId); // Stop checking once the condition is true
        doTimeUp();
      }
    }, 1000); // Check for other users to finish
  });

  /* Time Up*/
  const doTimeUp = async () => {
    doSubmit();
    navigate("/loading")
    setTimeout(() => {
      setSubmitted(false);
      navigate("/voting")
    }, 5000); // let server work
  }

  /* Submit Button */
  const doSubmit = async () => {
    if (submitted === false) {
      const ownUser = Number(localStorage.getItem("ownUserId"))
      setSubmitted(true);
      let text0 = topCaption.replace(/ /g, "%20");
      let text1 = bottomCaption.replace(/ /g, "%20");
      const username = "MemeBattleFrontend"
      const password = "dysryw-Nepjen-6gudha"
      const imgflip = await fetch(`https://api.imgflip.com/caption_image?template_id=${memeId}&username=${username}&password=${password}&text0=${text0}&text1=${text1}`)
      const data = await imgflip.json();
      const urlOnly = { MemeURL: data.data.url };
      setMeme(urlOnly.MemeURL, urlOnly);
      await api.post(`lobbys/${localStorage.getItem("lobbyId")}/memes/${ownUser}`, urlOnly);
    }
    
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
        <button className="home button_small left" onClick={() => doHome()}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
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
            <img src={meme} alt="meme template"></img>
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
