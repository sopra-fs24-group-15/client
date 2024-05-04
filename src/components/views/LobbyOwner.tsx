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
    localStorage.removeItem("ownUserId");
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
    const ownUser = Number(localStorage.getItem("ownUserId"));
    //TODO create game with settings
    const standardTime = 60
    const standardRounds = 5
    const requestBody1 = JSON.stringify({totalRounds: `${standardRounds}`, timer: `${standardTime}`});
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/settings/${ownUser}`, requestBody1);
    //TODO start game
    const requestBody2 = JSON.stringify({lobbyId: localStorage.getItem("lobbyId")});
    await api.put(`lobbys/${localStorage.getItem("lobbyId")}/start/${ownUser}`, requestBody2);
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/rounds/start`);
    navigate("/loading")
    setTimeout(() => {
      navigate("/createMeme");
    }, 3000); // Wait for 3 seconds
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
      const response1 = await api.get(`/lobbys/${lobbyId}`);
      setLobbycode(response1.data.lobbyJoinCode);
      let userList = [];
      const response2 = await api.get("/users");
      for (let i = 0; i < response2.data.length; i++) {
        if (response1.data.players.includes(response2.data[i].userId)) {
          userList.push(response2.data[i].username)
        }
      }
      setUsers(userList);
      const ownUser = Number(localStorage.getItem("ownUserId"));
      if (response1.data.lobbyOwner !== ownUser) {
        navigate("/lobby/player");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchUsers();

    const intervalId = setInterval(fetchUsers, 1000);

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
            <span key={index}>{user}</span>
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
