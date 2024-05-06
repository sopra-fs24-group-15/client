import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import Lobby from "models/Lobby";
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

const LobbyPlayer = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  const [lobbycode, setLobbycode] = useState<Lobby[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // Rules
  const [showRules, setShowRules] = useState(false);

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

  /* Users DIV*/
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
      if (response1.data.gameActive) {
        navigate("/loading")
        setTimeout(() => {
          navigate("/createMeme");
        }, 3000); // Wait for 3 seconds
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
        <button className="home button_small left" onClick={() => doHome()}>
          <img src={home} alt="Theme" className="home logo_small" />
        </button>
        <img src={logo} draggable="false" alt="Logo" className="home logo_small_middle"/>
        <button className="home button_small right" onClick={() => doRule()}>
          <img src={rules} alt="Theme" className="home logo_small" />
        </button>

        <p className="lobby title"> WAITING </p>

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
        <p style={{ textAlign: "center" }}>waiting for lobby owner to start the game</p>
        <Spinner />
        <br></br>
      </div>
    </BaseContainer>
  );
};

export default LobbyPlayer;
