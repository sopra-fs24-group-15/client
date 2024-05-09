import React from "react";
import PropTypes from "prop-types";
import "../../styles/ui/LeavePopUp.scss";

export const LeavePopUp = ({ close, leave }) => (
  <div className="popUp container">
    <div className="popUp text">
      <h1>Are you sure that you want to leave?</h1>
    </div>
    <div className="popUp buttonContainer">
    <button onClick={close} className="popUp button">No</button>
    <button onClick={leave} className="popUp button">Yes</button>
    </div>
  </div>
);


LeavePopUp.propTypes = {
  close: PropTypes.func.isRequired,
  leave: PropTypes.func.isRequired
};