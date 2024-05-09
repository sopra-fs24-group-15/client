import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Settings.scss";
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
  // Settings
  const [settingsRounds, setSettingsRounds] = useState<number>(0);
  const [settingsTime, setSettingsTime] = useState<number>(0);
  const [settingsMode, setSettingsMode] = useState<string>("BASIC");

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
    const ownUser = Number(localStorage.getItem("ownUserId"));
    const requestBody1 = JSON.stringify({totalRounds: `${settingsRounds}`, gameMode: `${settingsMode}`, timer: `${settingsTime}`});
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/settings/${ownUser}`, requestBody1);
    navigate("/lobby/owner");
  };

  const checkSettings = async () => {
    const settings = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/settings`);
    setSettingsRounds(settings.data.totalRounds);
    setSettingsTime(settings.data.timer);
    setSettingsMode(settings.data.gameMode);
  }
  useEffect(() => {
    checkSettings();
  }, []);

  return (
    <BaseContainer className="settings container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="settings content">
        <button className="home button_small left" onClick={() => doBack()}>
          <img src={back} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>
        <h1 className="settings title">SETTINGS</h1>
        <div className="settings button-container">
          <div className="settings button">
            <div className="settings selection">
              <h2>gamemode</h2>
              <Button 
                className="settings selectionButton2"
                disabled={settingsMode === "BASIC"}
                onClick={() => setSettingsMode("BASIC")}
              >
                basic
              </Button>
              <Button 
                className="settings selectionButton2"
                disabled={settingsMode === "TOPIC"}
                onClick={() => setSettingsMode("TOPIC")}
              >
                topic
              </Button>
            </div>
            <div className="settings selection">
              <h2>creating time</h2>
              <Button 
                className="settings selectionButton4"
                disabled={settingsTime === 30}
                onClick={() => setSettingsTime(30)}
              >
                30s
              </Button>
              <Button 
                className="settings selectionButton4"
                disabled={settingsTime === 45}
                onClick={() => setSettingsTime(45)}
              >
                45s
              </Button>
              <Button 
                className="settings selectionButton4"
                disabled={settingsTime === 60}
                onClick={() => setSettingsTime(60)}
              >
                60s
              </Button>
              <Button 
                className="settings selectionButton4"
                disabled={settingsTime === 75}
                onClick={() => setSettingsTime(75)}
              >
                75s
              </Button>
            </div>
            <div className="settings selection">
              <h2>rounds</h2>
              <Button 
                className="settings selectionButton4"
                disabled={settingsRounds === 3}
                onClick={() => setSettingsRounds(3)}
              >
                3
              </Button>
              <Button 
                className="settings selectionButton4"
                disabled={settingsRounds === 5}
                onClick={() => setSettingsRounds(5)}
              >
                5
              </Button>
              <Button 
                className="settings selectionButton4"
                disabled={settingsRounds === 10}
                onClick={() => setSettingsRounds(10)}
              >
                10
              </Button>
              <Button 
                className="settings selectionButton4"
                disabled={settingsRounds === 15}
                onClick={() => setSettingsRounds(15)}
              >
                15
              </Button>
            </div>

            <Button
              width="100%"
              className="settings saveButton"
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
