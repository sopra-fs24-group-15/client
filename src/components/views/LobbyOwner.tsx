import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { User } from "types";
// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import home from "../img/home.png";
//Rules
import { Rules } from "../ui/Rules";

const LobbyOwner = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);

  /* Home Button */
  const doHome = async () => {
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Game Settings */
  const gameSettings = async () => {
  };

  /* Start Game */
  const startGame = async () => {
  };

  /* Users DIV*/
  let names = ["Gian", "Marc2", "Jana", "Christoph", "Marc1"];
  const getUsers = async () => {
    //add logic to change names
  }

  return (
    <BaseContainer className="lobby container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="lobby content">
        <img src={home} draggable="false" alt="Back" className="lobby logo_small left" onClick={() => doHome()}/>
        <img src={logo} draggable="false" alt="Logo" className="lobby logo_small middle"/>
        <img src={rules} draggable="false" alt="Rules" className="lobby logo_small right" onClick={() => doRule()}/>

        <table className="lobby infoContainer">
          <tr className="infoLobbyCode">
            <td>LOBBY CODE</td>
            <td className="infoContent">code</td>
          </tr>
          <tr>
            <td>GAMEMODE</td>
            <td className="infoContent">standard</td>
          </tr>
          <tr>
            <td>CREATION TIME</td>
            <td className="infoContent">60s</td>
          </tr>
          <tr>
            <td>ROUNDS</td>
            <td className="infoContent">5</td>
          </tr>
        </table>
        <div className="lobby users">
          {names.map((name, index) => (
            <span key={index}>{name}</span>
          ))}
        </div>
        <div className="lobby button-container">
          <div className="lobby button">
            <Button
              width="100%"
              onClick={() => gameSettings()}
            >
              game settings
            </Button>
          </div>
          <div className="lobby button">
            <Button
              width="100%"
              onClick={() => startGame()}
              disabled={names.length < 3}
            >
              start game
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LobbyOwner;
