import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
import React, { useState} from "react";
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

const Loading = () => {
  //close
  window.onbeforeunload = (event) => {
    // Prevent the page from unloading
    event.preventDefault();
    if (localStorage.getItem("ownUserId") !== null) {
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
        <h1 className="loading title">LOADING</h1>
        <Spinner />

      </div>
    </BaseContainer>
  );
};

export default Loading;