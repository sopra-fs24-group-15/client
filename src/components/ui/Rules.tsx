import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/Rules.scss";

export const Rules = ({ close }) => (
  <div className="rules container">
    <div className="rules text">
      <h1>RULES</h1>
      <p>MAIN RULE: HAVE FUN</p>

      <h3>Basic Mode</h3>
      <ul>
        <li>There is a fixed amount of rounds played, standard: 5</li>
        <li>Everyones receives a template to create a meme</li>
        <li>Submit your meme and wait for the others.</li>
        <li>Vote for meme you like the most.</li>
        <li>Points</li>
        <ul>
          <li>Points: 1. 3 Points | 2. 2 Points | 3. 1 Point</li>
          <li>If you receive no vote but are still ranked 2. or 3. you wont receive any points.</li>
        </ul>
      </ul><br></br>

      <h3>Topic Mode</h3>
      <ul>
        <li>There is a fixed amount of rounds played, standard: 5</li>
        <li>The player ranked last receives 3 topics an can select one</li>
        <li>Everyone receives a template and the selected topic to create a meme</li>
        <li>Submit your meme and wait for the others.</li>
        <li>Vote for meme you like the most and fulfills the topic.</li>
        <li>Points are given to the top 3 players</li>
        <ul>
          <li>Points: 1. 3 Points | 2. 2 Points | 3. 1 Point</li>
          <li>If you receive no vote but are still ranked 2. or 3. you wont receive any points.</li>
        </ul>
      </ul>
      {/*
      <h3>Topic Mode</h3>
      <ul>
        <li>There is a fixed amount of rounds played, standard: 5</li>
        <li>The Player ranked last gets 3 topics an can select one</li>
        <li>Everyone receives a template and the selected topic to create a meme</li>
        <li>Submit your meme and wait for the others.</li>
        <li>Vote for each meme as following:</li>
        <ul>
          <li>++ : you like it, it fulfills the topic</li>
          <li>+- : you like it OR it fulfills the topic (not both)</li>
          <li>-- : you do not like it and it does not fulfill the topic</li>
        </ul>
        <li>Points are given to the top 3 players</li>
        <ul>
          <li>Points: 1. 3 Points | 2. 2 Points | 3. 1 Point</li>
          <li>If you receive no vote but are still ranked 2. or 3. you wont receive any points.</li>
        </ul>
      </ul>
        */}
    </div>
    <button onClick={close} className="rules button">Close</button>
  </div>
);


Rules.propTypes = {
  close: PropTypes.func.isRequired,
};