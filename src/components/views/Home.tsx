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

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  /*
  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };
  */
  const doCreate = async () => {
    navigate("/CreateLobby");
  };

  const doJoin = async () => {
    navigate("/JoinLobby");
  };

  /* define themes here!*/
  const themes = [
    ["#575757", "#000000", "#ffffff", "#1d1d1d", "#c3c3c3"],
    ["#d0d0d0", "#313131", "#000000", "#ffffff", "#575757" ]
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


    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accentDark", accentDark);
    document.documentElement.style.setProperty("--buttonTextColor", buttonTextColor);
    document.documentElement.style.setProperty("--normalTextColor", normalTextColor);
    document.documentElement.style.setProperty("--background", background);
  };

  return (
    <BaseContainer>
      <div className="home container">
        <div className="home form">
          <img src={theme} draggable="false" alt="Theme" className="home logo_small left" onClick={() => doTheme()}/>
          <img src={rules} draggable="false" alt="rules" className="home logo_small right"/>
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
