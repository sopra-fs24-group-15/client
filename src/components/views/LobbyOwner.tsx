import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
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

  const [lobbycode, setLobbycode] = useState<Lobby[]>([]);

  const [settingsRounds, setSettingsRounds] = useState<number>(0);
  const [settingsTime, setSettingsTime] = useState<number>(0);
  const [settingsMode, setSettingsMode] = useState("mode");

  /* Home Button */
  const doHome = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Rule Button */
  const doRule = async () => {
    setShowRules(!showRules);
  };

  /* Game Settings */
  const gameSettings = async () => {
    navigate("/lobby/owner/settings");
  };

  /* Start Game */
  const startGame = async () => {
    const ownUser = Number(localStorage.getItem("ownUserId"));
    //TODO create game with settings
    const requestBody1 = JSON.stringify({totalRounds: `${settingsRounds}`, timer: `${settingsTime}`});
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/settings/${ownUser}`, requestBody1);
    // start game
    const requestBody2 = JSON.stringify({lobbyId: localStorage.getItem("lobbyId")});
    await api.put(`lobbys/${localStorage.getItem("lobbyId")}/start/${ownUser}`, requestBody2);
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/rounds/start`);
    navigate("/loading")
    setTimeout(() => {
      navigate("/createMeme");
    }, 3000); // Wait for 3 seconds
  };

  const fetchUsers = async () => {
    try {
      const lobbyId = localStorage.getItem("lobbyId");
      const response1 = await api.get(`/lobbys/${lobbyId}`);
      setLobbycode(response1.data.lobbyJoinCode);
      let userList = [];
      const response2 = await api.get("/users");
      for (const element of response2.data) {
        if (response1.data.players.includes(element.userId)) {
          userList.push(element.username)
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

  // setup with basic game, standard settings
  const checkSettings = async () => {
    try {
      const settings = await api.get(`/lobbys/${localStorage.getItem("lobbyId")}/settings`);
      setSettingsRounds(settings.data.totalRounds);
      setSettingsTime(settings.data.timer);
      setSettingsMode(settings.data.gameMode);
    } catch (error) {
      const ownUser = Number(localStorage.getItem("ownUserId"));
      setSettingsRounds(5)
      setSettingsTime(60)
      const standardTime = 60
      const standardRounds = 5
      const requestBody1 = JSON.stringify({totalRounds: `${standardRounds}`, timer: `${standardTime}`});
      await api.post(`lobbys/${localStorage.getItem("lobbyId")}/settings/${ownUser}`, requestBody1);
    }
  }

  useEffect(() => {
    checkSettings();
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
        <button className="home button_small left" onClick={() => doHome()}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>

        <table className="lobby infoContainer">
          <tr className="infoLobbyCode">
            <td>LOBBY CODE</td>
            <td className="infoContent">{lobbycode}</td>
          </tr>
          <tr>
            <td>GAMEMODE</td>
            <td className="infoContent">{settingsMode.toLowerCase()}</td>
          </tr>
          <tr>
            <td>CREATION TIME</td>
            <td className="infoContent">{settingsTime}s</td>
          </tr>
          <tr>
            <td>ROUNDS</td>
            <td className="infoContent">{settingsRounds}</td>
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
