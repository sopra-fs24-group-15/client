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
const FormField1 = (props) => {
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
FormField1.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const FormField2 = (props) => {
  return (
    <div className="home field">
      <label className="home label">{props.label}</label>
      <input
        className="home input"
        placeholder="Join code"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField2.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const JoinLobby = () => {
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [username, setUsername] = useState<string>(null);
  const [joinLobby, setJoinLobby] = useState<string>(null);
  const [errorUsername, setErrorUsername] = useState(null);
  const [errorJoincode, setErrorJoincode] = useState(null);

  /* Back Button */
  const doBack = async () => {
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Create Lobby Button */
  const doJoin = async () => {
    setErrorUsername(null);
    setErrorJoincode(null);
    //TODO create Lobby logic, go to lobby
    const requestBody = JSON.stringify({username: username, isOwner: false});
    console.log("Request to create user: " , requestBody);
    try{
      const createUserResponse = await api.post("/users", requestBody);
      const user = new User(createUserResponse.data);
      localStorage.setItem("ownUserId", user.userId);
      console.log("Server response: ", createUserResponse.data);
      const requestBody2 = JSON.stringify({lobbyJoinCode: joinLobby});
      console.log(requestBody2);
      try{
        const createLobbyResponse = await api.put(`/lobbys/${user.userId}`, requestBody2);
        console.log(createLobbyResponse.data);
        const lobby = new Lobby(createLobbyResponse.data);
        localStorage.setItem("lobbyId", lobby.lobbyId);
        //TODO create Lobby logic, go to lobby
        navigate("/lobby/player");
      }
      catch (err) {
        const ownUser = localStorage.getItem("ownUserId");
        localStorage.removeItem("ownUserId");
        const removeUser = await api.delete(`/users/${ownUser}`);
        setErrorJoincode(err.message);
      }
    }
    catch (err) {
      setErrorUsername(err.message);
    }
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
          {errorUsername && <div className="home error">Username already taken</div>}
          <FormField1
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          {errorJoincode && <div className="home error">Invalid Join Code</div>}
          <FormField2
            value={joinLobby}
            onChange={(n) => setJoinLobby(n)}
          />
          <div className="home button-container">
            <Button
              disabled={!username || !joinLobby}
              width="100%"
              onClick={() => doJoin()}
            >
              Join
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
export default JoinLobby;
