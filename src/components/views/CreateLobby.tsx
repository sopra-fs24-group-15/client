import React, { useState } from "react";
import { api, handleError } from "helpers/api";
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
        placeholder="username"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const CreateLobby = () => {
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [username, setUsername] = useState<string>(null);

  /* Back Button */
  const doBack = async () => {
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Create Lobby Button */
  const doCreate = async () => {
    const requestBody = JSON.stringify({username: username, isOwner: true});
    console.log("Request to create user: " , requestBody);
    const createUserResponse = await api.post("/users", requestBody);
    const user = new User(createUserResponse.data);
    console.log("Server response: ", createUserResponse.data);
    const requestBody2 = JSON.stringify({lobbyOwner: user.userId });
    console.log(requestBody2);
    const createLobbyResponse = await api.post("/lobbys", requestBody2);
    console.log(createLobbyResponse.data);
    const lobby = new Lobby(createLobbyResponse.data);
    localStorage.setItem("lobbyId", lobby.lobbyId);
    //TODO create Lobby logic, go to lobby
    navigate("/lobby/owner");
  };

  return (
    <BaseContainer>
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="home container">
        <div className="home form">
          <img src={back} draggable="false" alt="Back" className="home logo_small left" onClick={() => doBack()}/>
          <img src={logo} draggable="false" alt="Logo" className="home logo_small middle"/>
          <img src={rules} draggable="false" alt="Rules" className="home logo_small right" onClick={() => doRule()}/>
          <FormField
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <div className="home button-container">
            <Button
              disabled={!username}
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
