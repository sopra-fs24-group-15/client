import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
// @ts-ignore
import logo from "../ui/logo.png";
// @ts-ignore
import rules from "../ui/rules.png";
// @ts-ignore
import theme from "../ui/theme.png";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Login = () => {
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
    ["#484848", "#000000", "#ffffff", "#9b9b9b"],
    ["#d0d0d0", "#313131", "#000000", "#454545"]
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
    let textColor = themes[activeTheme][2];
    let background = themes[activeTheme][3];

    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accentDark", accentDark);
    document.documentElement.style.setProperty("--textColor", textColor);
    document.documentElement.style.setProperty("--background", background);
    console.log("test")
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <img src={theme} draggable="false" alt="Theme" className="login logo_small left" onClick={() => doTheme()}/>
          <img src={rules} draggable="false" alt="rules" className="login logo_small right"/>
          <img src={logo} draggable="false" alt="Logo" className="login logo_large"/>
          <div className="login button-container">
            <Button
              width="100%"
              onClick={() => doCreate()}
            >
              Create Lobby
            </Button>
          </div>
          <div className="login button-container">
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
export default Login;
