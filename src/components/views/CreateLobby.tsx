import React, { useState } from "react";
import { api } from "helpers/api";
import User from "models/User";
import Lobby from "models/Lobby";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Home.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import back from "../img/back.png";
//Rules
import { Rules } from "../ui/Rules";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="home field">
      <input
        className="home input"
        placeholder="Username"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const CreateLobby = () => {
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [username, setUsername] = useState<string>(null);
  const [errorUsername, setErrorUsername] = useState(null);
  const [errorUsernameLength, setErrorUsernameLength] = useState(null);

  /* Back Button */
  const doBack = async () => {
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  const validateUsername = (username: string) => {
    setUsername(username);
    setErrorUsername(null);
    if (username.length > 15) {
      setErrorUsernameLength("Username must bew 15 characters or less");
    } else {
      setErrorUsernameLength(null);
    }
  };

  /* Create Lobby Button */
  const doCreate = async () => {
    setErrorUsername(null);
    setErrorUsernameLength(null);

    if (username && username.length > 15) {
      setErrorUsernameLength("Username must be 15 characters or less");

      return;
    }

    const requestBody = JSON.stringify({username: username, isOwner: true});
    console.log("Request to create user: " , requestBody);

    try{
      const createUserResponse = await api.post("/users", requestBody);
      const user = new User(createUserResponse.data)
      console.log("User created: ", user);
      localStorage.setItem("ownUserId", user.userId);
      localStorage.setItem("username", username);
      const requestBody2 = JSON.stringify({lobbyOwner: user.userId });
      const createLobbyResponse = await api.post("/lobbys", requestBody2);
      console.log(createLobbyResponse.data);
      const lobby = new Lobby(createLobbyResponse.data);
      localStorage.setItem("lobbyId", lobby.lobbyId);
      navigate("/lobby/owner");
    }
    catch (err) {
      setErrorUsername(err.message);
    }
  };

  return (
    <BaseContainer>
      <div className="home rulediv">
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="home container">
        <div className="home form">
          <button className="home button_small left" onClick={() => doBack()}>
            <img src={back} alt="Theme" className="home logo_small" />
          </button>
          <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
          <button className="home button_small right" onClick={() => doRule()}>
            <img src={rules} alt="Theme" className="home logo_small" />
          </button>
          {errorUsername && <div className="home error">Username already taken</div>}
          {errorUsernameLength && <div className="home error">{errorUsernameLength}</div>}
          <FormField
            value={username}
            onChange={validateUsername}
          />
          <div className="home button-container">
            <Button
              disabled={!username || username.length > 15 || errorUsername}
              width="100%"
              onClick={() => doCreate()}
            >
              Create Lobby
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
export default CreateLobby;