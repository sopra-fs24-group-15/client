import "styles/views/Loading.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
import React, { useState} from "react";
import { api } from "helpers/api";
import {useNavigate} from "react-router-dom";

// @ts-ignore
import logo from "../img/logo.png";
// @ts-ignore
import rules from "../img/rules.png";
// @ts-ignore
import home from "../img/home.png";
//Rules
import { Rules } from "../ui/Rules";

const Loading = () => {
  // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate 
  const navigate = useNavigate();
  // Rules
  const [showRules, setShowRules] = useState(false);
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

    
  return (
    <BaseContainer className="loading container">
      <div>
        {showRules && <Rules close={() => setShowRules(false)} />}
      </div>
      <div className="loading content">
        <img src={home} draggable="false" alt="Back" className="loading logo_small left" onClick={() => doHome()}/>
        <img src={logo} draggable="false" alt="Logo" className="loading logo_small middle"/>
        <img src={rules} draggable="false" alt="Rules" className="loading logo_small right" onClick={() => doRule()}/>
        <h1 className="loading title">LOADING</h1>
        <Spinner />

      </div>
    </BaseContainer>
  );
};

export default Loading;