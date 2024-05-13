import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import theme from "../img/theme.png";
//Rules
import { Rules } from "../ui/Rules";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Home = () => {
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);

  const doCreate = async () => {
    navigate("/CreateLobby");
  };

  const doJoin = async () => {
    navigate("/JoinLobby");
  };

  /* define themes here!*/
  const themes = [
    ["#575757", "#000000", "#ffffff", "#1d1d1d", "#c3c3c3", "rgba(214, 214, 214, 0.5)"],
    ["#d0d0d0", "#313131", "#000000", "#ffffff", "#575757", "rgba(44, 44, 44, 0.5)"],
  ]
  let activeTheme = 0;
  
  /*change themes function*/
  const doTheme = () => {
    activeTheme += 1;
    if (activeTheme >= themes.length) {
      activeTheme = 0;
    }
    let accent = themes[activeTheme][0];
    let accentDark = themes[activeTheme][1];
    let buttonTextColor = themes[activeTheme][2];
    let normalTextColor = themes[activeTheme][3];
    let background = themes[activeTheme][4];
    let background_blur = themes[activeTheme][5];

    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accentDark", accentDark);
    document.documentElement.style.setProperty("--buttonTextColor", buttonTextColor);
    document.documentElement.style.setProperty("--normalTextColor", normalTextColor);
    document.documentElement.style.setProperty("--background", background);
    document.documentElement.style.setProperty("--background_blur", background_blur);
  };

  const doRule = () => {
    setShowRules(!showRules);
  };

  return (
    <BaseContainer>
      <div className="home rulediv">
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="home container">
        <div className="home form">
          <button className="home button_small left" onClick={() => doTheme()}>
            <img src={theme} alt="Theme" className="home logo_small" />
          </button>
          <button className="home button_small right" onClick={() => doRule()}>
            <img src={rules} alt="Theme" className="home logo_small" />
          </button>
          <img src={logo} draggable="false" alt="Logo" className="home logo_large"/>
          <div className="home button-container">
            <Button
              width="100%"
              onClick={() => doCreate()}
            >
              Create Lobby
            </Button>
          </div>
          <div className="home button-container">
            <Button
              width="100%"
              onClick={() => doJoin()}
            >
              Join Lobby
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Home;
