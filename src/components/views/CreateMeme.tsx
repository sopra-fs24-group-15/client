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
import { LeavePopUp } from "../ui/LeavePopUp";

const FormField1 = (props) => {
  return (
    <div className="createMeme field">
      <input
        className="createMeme input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
FormField1.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const LobbyPlayer = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // meme
  const [meme, setMeme] = useState(" ");
  const [memeId, setMemeId] = useState(1);
  const [boxCount, setBoxCount] = useState(0);
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [showLeavePopUp, setShowLeavePopUp] = useState(false);
  // Topic
  const [topic, setTopic] = useState("");
  // Captions
  const [topCaption, setTopCaption] = useState<string>("");
  const [secondCaption, setSecondCaption] = useState<string>("");
  const [thirdCaption, setThirdCaption] = useState<string>("");
  const [fourthCaption, setFourthCaption] = useState<string>("");
  // Disable submit button
  const [submitted, setSubmitted] = useState(false);
  // SettingsDuration
  const [settingsDuration, setSettingsDuration] = useState(0);
  // RoundCounter
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);

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

  /* Creation Time */
  const checkSettings = async () => {
    const settings = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/settings`);
    setSettingsDuration(settings.data.timer);
    setTotalRounds(settings.data.totalRounds);
    const round = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/rounds`);
    setCurrentRound(round.data);
  }
  checkSettings();

  /* Meme */
  const getMeme = async () => {
    const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/templates`);
    // setTopic
    if (response.data.topic) {
      setTopic(response.data.topic);
    }
    setMeme(response.data.url);
    console.log(response.data.url);
    console.log(boxCount);
    console.log(response.data.templateId);
    if (response.data.boxCount === 2) {
      let text0 = "Text%201";
      let text1 = "Text%202";
      const username = "MemeBattleFrontend"
      const password = "dysryw-Nepjen-6gudha"
      setMemeId(response.data.templateId);
      setBoxCount(response.data.boxCount);
      console.log(memeId);
      const imgflip = await fetch(`https://api.imgflip.com/caption_image?template_id=${response.data.templateId}&username=${username}&password=${password}&text0=${text0}&text1=${text1}`)
      const data = await imgflip.json();
      const urlOnly = { MemeURL: data.data.url };
      setMeme(urlOnly.MemeURL, urlOnly);
    } 
    else if (response.data.boxCount === 3) {
      const boxes = [
        {
          "text": "Text 1",
          "color": "#ffffff",
          "outline_color": "#000000"
        },
        {
          "text": "Text 2",
          "color": "#ffffff",
          "outline_color": "#000000"
        },
        {
          "text": "Text 3",
          "color": "#ffffff",
          "outline_color": "#000000"
        }
      ]
      const username = "MemeBattleFrontend"
      const password = "dysryw-Nepjen-6gudha"
      console.log(boxes);
      setMemeId(response.data.templateId);
      setBoxCount(response.data.boxCount);
      const url = `https://api.imgflip.com/caption_image?template_id=${response.data.templateId}&username=${username}&password=${password}&boxes[0][text]=${boxes[0]["text"]}&boxes[1][text]=${boxes[1]["text"]}&boxes[2][text]=${boxes[2]["text"]}`;
      const imgflip = await fetch(url);
      const data = await imgflip.json();
      console.log(data.data.url)
      const urlOnly = { MemeURL: data.data.url };
      setMeme(urlOnly.MemeURL, urlOnly);
    }
    else if (response.data.boxCount === 4) {
      const boxes = [
        {
          "text": "Text 1",
          "color": "#ffffff",
          "outline_color": "#000000"
        },
        {
          "text": "Text 2",
          "color": "#ffffff",
          "outline_color": "#000000"
        },
        {
          "text": "Text 3",
          "color": "#ffffff",
          "outline_color": "#000000"
        },
        {
          "text": "Text 4",
          "color": "#ffffff",
          "outline_color": "#000000"
        }
      ]
      const username = "MemeBattleFrontend"
      const password = "dysryw-Nepjen-6gudha"
      console.log(boxes);
      setMemeId(response.data.templateId);
      setBoxCount(response.data.boxCount);
      const url = `https://api.imgflip.com/caption_image?template_id=${response.data.templateId}&username=${username}&password=${password}&boxes[0][text]=${boxes[0]["text"]}&boxes[1][text]=${boxes[1]["text"]}&boxes[2][text]=${boxes[2]["text"]}&boxes[3][text]=${boxes[3]["text"]}`;
      const imgflip = await fetch(url);
      const data = await imgflip.json();
      console.log(data.data.url)
      const urlOnly = { MemeURL: data.data.url };
      setMeme(urlOnly.MemeURL, urlOnly);
    }
        
    console.log("BoxCount " + boxCount);
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
      if (boxCount === 2) {
        let newTopCaption = topCaption;
        let newSecondCaption = secondCaption;
        if (newTopCaption === "") {
          newTopCaption = " ";
        }
        if (newSecondCaption === "") {
          newSecondCaption = " ";
        } 
        let text0 = newTopCaption.replace(/ /g, "%20");
        let text1 = newSecondCaption.replace(/ /g, "%20");
        const username = "MemeBattleFrontend"
        const password = "dysryw-Nepjen-6gudha"
        console.log(text0, text1);
        const imgflip = await fetch(`https://api.imgflip.com/caption_image?template_id=${memeId}&username=${username}&password=${password}&text0=${text0}&text1=${text1}`)
        const data = await imgflip.json();
        const urlOnly = { MemeURL: data.data.url };
        setMeme(urlOnly.MemeURL, urlOnly);
        await api.post(`lobbys/${localStorage.getItem("lobbyId")}/memes/${ownUser}`, urlOnly);
      } 
      else if (boxCount === 3) {
        const boxes = [
          {
            "text": topCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          },
          {
            "text": secondCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          },
          {
            "text": thirdCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          }
        ]
        const username = "MemeBattleFrontend"
        const password = "dysryw-Nepjen-6gudha"
        console.log(boxes);
        for (let i = 0; i<3; i++) {
          if (boxes[i]["text"]=== "") {
            boxes[i]["text"]= " ";
          }
        }
        console.log(boxes);
        const url = `https://api.imgflip.com/caption_image?template_id=${memeId}&username=${username}&password=${password}&boxes[0][text]=${boxes[0]["text"]}&boxes[1][text]=${boxes[1]["text"]}&boxes[2][text]=${boxes[2]["text"]}`;
        const imgflip = await fetch(url);
        const data = await imgflip.json();
        const urlOnly = { MemeURL: data.data.url };
        setMeme(urlOnly.MemeURL, urlOnly);
        await api.post(`lobbys/${localStorage.getItem("lobbyId")}/memes/${ownUser}`, urlOnly);
      }
      else if (boxCount === 4) {
        const boxes = [
          {
            "text": topCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          },
          {
            "text": secondCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          },
          {
            "text": thirdCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          },
          {
            "text": fourthCaption,
            "color": "#ffffff",
            "outline_color": "#000000"
          }
        ]
        const username = "MemeBattleFrontend"
        const password = "dysryw-Nepjen-6gudha"
        console.log(boxes);
        for (let i = 0; i<4; i++) {
          if (boxes[i]["text"]=== "") {
            boxes[i]["text"] = " ";
          }
        }
        console.log(boxes);
        const url = `https://api.imgflip.com/caption_image?template_id=${memeId}&username=${username}&password=${password}&boxes[0][text]=${boxes[0]["text"]}&boxes[1][text]=${boxes[1]["text"]}&boxes[2][text]=${boxes[2]["text"]}&boxes[3][text]=${boxes[3]["text"]}`;
        const imgflip = await fetch(url);
        const data = await imgflip.json();
        const urlOnly = { MemeURL: data.data.url };
        setMeme(urlOnly.MemeURL, urlOnly);
        await api.post(`lobbys/${localStorage.getItem("lobbyId")}/memes/${ownUser}`, urlOnly);
      }
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
        {showLeavePopUp && <LeavePopUp close={() => setShowLeavePopUp(false)} leave={() => handleLeave()} />}
      </div>

      <div className="createMeme content">
        <button className="home button_small left" onClick={toggleLeavePopUp}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        <h1 className = "CreateMeme roundCounter">Round {currentRound}/{totalRounds}</h1>
        {topic !== "" && <h2>TOPIC: {topic}</h2>}
        {!submitted && (
          <FormField1
            placeholder= "Text 1"
            value={topCaption}
            onChange={(n) => setTopCaption(n)}
          />
        )}
        {!submitted  && (<FormField1
          placeholder= "Text 2"
          value = {secondCaption}
          onChange={(n) => setSecondCaption(n)}
        />)}

        {!submitted && boxCount >= 3 && (
          <FormField1
            placeholder= "Text 3"
            value={thirdCaption}
            onChange={(n) => setThirdCaption(n)}
          />
        )}
        {!submitted && boxCount === 4 && 2 < boxCount &&(<FormField1
          placeholder= "Text 4"
          value = {fourthCaption}
          onChange={(n) => setFourthCaption(n)}
        />)}

        <div className="createMeme memeContainer">
          
          <div className="CreateMeme timer-wrapper">
            <h1 className="createMeme timerTitle">countdown</h1>
            <CountdownCircleTimer
              isPlaying
              duration={settingsDuration}
              strokeWidth={20}
              size={180}
              colors={["#adf7b6", "#fcf5c7", "#fce1e4"]}
              colorsTime={[settingsDuration, settingsDuration / 2, 0]}
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
      </div>
    </BaseContainer>
  );
};

export default LobbyPlayer;