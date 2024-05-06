import React, { useState } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import back from "../img/back.png";
//Rules
import { Rules } from "../ui/Rules";

const Settings = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);

  /* Back Button */
  const doBack = async () => {
    navigate("/lobby/owner")
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Save Settings Button */
  const doSaveSettings = async () => {
    //TODO send settings to server
  };

  return (
    <BaseContainer className="lobby container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="lobby content">
        <button className="home button_small left" onClick={() => doBack()}>
          <img src={back} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        <h1>SETTINGS</h1>
        
        <div className="settings button-container">
          <div className="settings button">
            <Button
              width="100%"
              onClick={() => doSaveSettings()}
            >
              save changes
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Settings;
