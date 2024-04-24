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
import Lobby from "models/Lobby";

const LobbyOwner = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  //const [users, setUsers] = useState([]);

  const [lobbycode, setLobbycode] = useState<Lobby[]>([]);

  /* Home Button */
  const doHome = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    const removeUser = await api.delete(`/users/${ownUser}`);
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
    navigate("/createMeme")
  };

  /* Users DIV
  let names = ["Gian", "Marc2", "Jana", "Christoph", "Marc1"];
  const getUsers = async () => {
    //add logic to change names
  }
  */

  const fetchUsers = async () => {
    try {
      const lobbyId = localStorage.getItem("lobbyId");
      console.log(lobbyId);
      const response = await api.get(`/lobbys/${lobbyId}`);
      console.log(response.data);
      setLobbycode(response.data.lobbyJoinCode);
      setUsers(response.data.players);
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchUsers();

    const intervalId = setInterval(fetchUsers, 5000);

    return () => clearInterval(intervalId);
  }, []);

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
            <td className="infoContent">{lobbycode}</td>
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
          {users.map((user, index) => (
            <span key={index}>{user.username}</span>
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
              disabled={users.length < 3}
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
