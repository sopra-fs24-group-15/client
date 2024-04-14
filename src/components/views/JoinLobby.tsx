import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import back from "../img/back.png";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField1 = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
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
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [lobby, setLobby] = useState<string>(null);

  /* Back Button */
  const doBack = async () => {
    navigate("/login");
  };

  /* Rule Button */
  const doRule = async () => {
    //TODO go to rule page
  };

  /* Create Lobby Button */
  const doJoin = async () => {
    //TODO create Lobby logic, go to lobby
    navigate("/lobby/player");
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <img src={back} draggable="false" alt="Back" className="login logo_small left" onClick={() => doBack()}/>
          <img src={logo} draggable="false" alt="Logo" className="login logo_small middle"/>
          <img src={rules} draggable="false" alt="Rules" className="login logo_small right" onClick={() => doRule()}/>
          <FormField1
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField2
            value={lobby}
            onChange={(n) => setLobby(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !lobby}
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
export default Login;
