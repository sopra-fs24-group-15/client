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

const Player = ({ user }: { user: User }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const Lobby = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://react.dev/learn/state-a-components-memory and https://react.dev/reference/react/useState 
  const [users, setUsers] = useState<User[]>(null);

  const logout = (): void => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* Home Button */
  const doHome = async () => {
    navigate("/login");
  };

  /* Rule Button */
  const doRule = async () => {
    //TODO go to rule page
  };


  // TODO reactivate loading spinner
  //let content = <Spinner />;
  let content;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <BaseContainer className="lobby container">

      <img src={home} draggable="false" alt="Back" className="login logo_small left" onClick={() => doHome()}/>
      <img src={logo} draggable="false" alt="Logo" className="login logo_small middle"/>
      <img src={rules} draggable="false" alt="Rules" className="login logo_small right" onClick={() => doRule()}/>

      <table className="lobby infoContainer">
        <tr className="infoLobbyCode">
          <td>lobby code</td>
          <td>:</td>
          <td className="infoContent">CODE</td>
        </tr>
        <tr>
          <td>gamemode</td>
          <td>:</td>
          <td className="infoContent">standard</td>
        </tr>
        <tr>
          <td>creation time</td>
          <td>:</td>
          <td className="infoContent">60s</td>
        </tr>
        <tr>
          <td>rounds</td>
          <td>:</td>
          <td className="infoContent">5</td>
        </tr>
      </table>
      {content}
    </BaseContainer>
  );
};

export default Lobby;
