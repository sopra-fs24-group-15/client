import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Home from "../../views/Home";
import CreateLobby from "../../views/CreateLobby";
import JoinLobby from "../../views/JoinLobby";
import LobbyOwner from "../../views/LobbyOwner";
import Settings from "../../views/Settings";
import LobbyPlayer from "../../views/LobbyPlayer";
import CreateMeme from "../../views/CreateMeme";
import Voting from "../../views/Voting";
import Scoreboard from "../../views/Scoreboard";
import Loading from "../../views/Loading";


/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lobby/owner" element={<GameGuard />}>
          <Route path="/lobby/owner" element={<LobbyOwner/>} />
        </Route>

        <Route path="/lobby/owner/settings" element={<GameGuard />}>
          <Route path="/lobby/owner/settings" element={<Settings/>} />
        </Route>

        <Route path="/lobby/player" element={<GameGuard />}>
          <Route path="/lobby/player" element={<LobbyPlayer/>} />
        </Route>

        <Route path="/home" element={<LoginGuard />}>
          <Route path="/home" element={<Home/>} />
        </Route>

        <Route path="/createLobby" element={<LoginGuard />}>
          <Route path="/createLobby" element={<CreateLobby/>} />
        </Route>

        <Route path="/joinLobby" element={<LoginGuard />}>
          <Route path="/joinLobby" element={<JoinLobby/>} />
        </Route>

        <Route path="/createMeme" element={<GameGuard />}>
          <Route path="/createMeme" element={<CreateMeme/>} />
        </Route>

        <Route path="/voting" element={<GameGuard />}>
          <Route path="/voting" element={<Voting/>} />
        </Route>

        <Route path="/scoreboard" element={<GameGuard />}>
          <Route path="/scoreboard" element={<Scoreboard/>} />
        </Route>

        <Route path="/loading" element={<GameGuard />}>
          <Route path="/loading" element={<Loading/>} />
        </Route>

        <Route path="/" element={
          <Navigate to="/home" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
