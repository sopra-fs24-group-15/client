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
        <li>You receive a picture, now add your text to make a good meme.</li>
        <li>Submit your meme and wait for the others.</li>
        <li>Vote for meme you like the most.</li>
        <li>Points</li>
        <ul>
          <li>Points: 1. 3 Points | 2. 2 Points | 3. 1 Point</li>
          <li>If you receive no vote but are still ranked 2. or 3. you wont receive any points.</li>
        </ul>

      </ul>
    </div>
    <button onClick={close} className="rules button">Close</button>
  </div>
);

Rules.propTypes = {
  close: PropTypes.func.isRequired,
};