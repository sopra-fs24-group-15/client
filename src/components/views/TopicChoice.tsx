import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
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

const TopicChoice = () => {
  //close
  window.onbeforeunload = (event) => {
    // Prevent the page from unloading
    event.preventDefault();
    if (localStorage.getItem("ownUserId") !== null) {
      if (doSelect){
        api.post(`/lobbys/${localStorage.getItem("lobbyId")}/topics/${localStorage.getItem("ownUserId")}`, selectableTopics[1])
      }
      api.delete(`/users/${localStorage.getItem("ownUserId")}`);
      localStorage.removeItem("ownUserId");
      navigate("/home");
    }
    
    return "Are you sure you want to leave?";
  };
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [showLeavePopUp, setShowLeavePopUp] = useState(false);
  /* Home Button */
  const [doSelect, setDoSelect] = useState(false);
  const [selectableTopics, setSelectableTopics] = useState([]);

  const handleLeave = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    if (doSelect) {
      api.post(`/lobbys/${localStorage.getItem("lobbyId")}/topics/${localStorage.getItem("ownUserId")}`, selectableTopics[1])
    }
    localStorage.removeItem("ownUserId");
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Leave Button */
  const toggleLeavePopUp = async () => {
    setShowLeavePopUp(!showLeavePopUp);
  };  

  const checkSelected = async () => {
    const response = await api.get(`lobbys/${localStorage.getItem("lobbyId")}/templates`);
    if (response.data.topic !== null){
      navigate("/loading");
      setTimeout(() => {
        navigate("/createMeme");
      }, 3000); // Wait for 3 seconds
    }
  }

  /* Listen if choice was made */
  useEffect(() => {
    let intervalId = null;
  
    if (!doSelect) {
      intervalId = setInterval(() => {
        checkSelected();
      }, 1000); // Change this to the desired interval
    } else if (intervalId) {
      clearInterval(intervalId);
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [doSelect]); 

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Check if you can select */
  const checkSelect = async () => {
    const response = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/users/${localStorage.getItem("ownUserId")}/lowest-score`)
    setDoSelect(response.data)
    console.log(response.data)
    const topics = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/templates`)
    setSelectableTopics(topics.data.topics)
  }

  useEffect(() => {
    checkSelect();
  }, []);

  const handleTopicSelect = async (topic) => { 
    console.log(topic)
    await api.post(`/lobbys/${localStorage.getItem("lobbyId")}/topics/${localStorage.getItem("ownUserId")}`, topic);
    checkSelected(); 
  }

  return (
    <BaseContainer className="loading container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
        {showLeavePopUp && <LeavePopUp close={() => setShowLeavePopUp(false)} leave={() => handleLeave()} />}
      </div>
      <div className="loading content">
        <button className="home button_small left" onClick={toggleLeavePopUp}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        {!doSelect ? (
          <>
            <h1 className="loading title">waiting for user to select topic</h1>
            <Spinner />
          </>
        ) :
          <>
            <h1 className="loading title">Select a topic!</h1>
            <div>
              {selectableTopics.map((topic, index) => (
                <Button 
                  key={index}
                  className="loading selectButton"
                  onClick={() => handleTopicSelect(topic)}>
                  {topic}
                </Button>
              ))}
            </div>
          </>
        }

      </div>
    </BaseContainer>
  );
};

export default TopicChoice;