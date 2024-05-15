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
// @ts-ignore
import refresh from "../img/refresh.png";
//Rules
import { LeavePopUp } from "../ui/LeavePopUp";
import { Rules } from "../ui/Rules";
import Lobby from "models/Lobby";

const LobbyOwner = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
  const [showLeavePopUp, setShowLeavePopUp] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const [lobbycode, setLobbycode] = useState<Lobby[]>([]);

  const [settingsRounds, setSettingsRounds] = useState<number>(5);
  const [settingsTime, setSettingsTime] = useState<number>(60);
  const [settingsMode, setSettingsMode] = useState("BASIC");

  const profileImages = {}
  const totalImages = 15;

  for (let i = 1; i <= totalImages; i++) {
    profileImages[i] = `${i}.png`;
  }

  /* Home Button */
  const handleLeave = async () => {
    const ownUser = localStorage.getItem("ownUserId");
    localStorage.removeItem("ownUserId");
    await api.delete(`/users/${ownUser}`);
    navigate("/home");
  };

  /* Leave Button */
  const toggleLeavePopUp = async () => {
    setShowLeavePopUp(!showLeavePopUp);
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
    // create game with settings
    const requestBody1 = JSON.stringify({totalRounds: `${settingsRounds}`, gameMode: `${settingsMode}`, timer: `${settingsTime}`});
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/settings/${ownUser}`, requestBody1);
    // start game
    await api.put(`lobbys/${localStorage.getItem("lobbyId")}/start/${ownUser}`);
    await api.post(`lobbys/${localStorage.getItem("lobbyId")}/rounds/start`);
    navigate("/loading")
    setTimeout(() => {
      if (settingsMode === "TOPIC"){
        navigate("/topicChoice");
      } else {
        navigate("/createMeme");
      }
    }, 3000); // Wait for 3 seconds
  };

  const fetchUsers = async () => {
    try {
      const lobbyId = localStorage.getItem("lobbyId");
      const response = await api.get(`/lobbys/${lobbyId}`);
      setLobbycode(response.data.lobbyJoinCode);
      const userResponse = await api.get("/users");
      const userList = userResponse.data
        .filter(user => response.data.players.includes(user.userId))
        .map(user => ({
          username: user.username,
          userId: user.userId,
          profilePicture: user.profilePicture
        }));
      setUsers(userList);
      const ownUser = Number(localStorage.getItem("ownUserId"));
      if (response.data.lobbyOwner !== ownUser) {
        navigate("/lobby/player");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const UpdateProfilePicture = async () => {
    try {
      const userId = localStorage.getItem("ownUserId");
      console.log(userId);
      api.put(`/users/${userId}/profilepictures`);
      fetchUsers();
    }
    catch (error) {
      console.log(error);
    }
  }

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
      setSettingsMode("BASIC")
      const requestBody1 = JSON.stringify({totalRounds: `${settingsRounds}`, gameMode: `${settingsMode}`, timer: `${settingsTime}`});
      await api.post(`lobbys/${localStorage.getItem("lobbyId")}/settings/${ownUser}`, requestBody1);
    }
  }
  checkSettings();

  useEffect(() => {
    fetchUsers();

    const intervalId = setInterval(fetchUsers, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <BaseContainer className="lobby container">
      <div className="home rulediv">
        {showRules && <Rules close={() => setShowRules(false)} />}
        {showLeavePopUp && <LeavePopUp close={() => toggleLeavePopUp()} leave={() => handleLeave()}/>}
      </div>
      <div className="lobby content">
        <button className="home button_small left" onClick={toggleLeavePopUp}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>

        <table className="lobby infoContainer">
          <tr className="infoLobbyCode">
            <td>JOIN CODE</td>
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
        <div className="lobby users-container">
          {users.map((user, index) => (
            <div key={index} className="user-profile"> 
              <img
                src={require(`../img/profilePictures/${profileImages[user.profilePicture]}`)} 
                alt={user.username}
                className="user-profile-picture"/>
              {Number(user.userId) === Number(localStorage.getItem("ownUserId")) && (
                <button 
                  className="user refresh-button" 
                  onClick={() => UpdateProfilePicture()}>
                  <img 
                    src={refresh} 
                    alt="Refresh"/>
                </button>
              )}
              <span>  
                <div className="user-profile-name">
                  {user.username}
                </div>
              </span>
            </div>
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