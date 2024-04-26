import React from "react";
import {ReactLogo} from "../ui/ReactLogo";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component 
 * @FunctionalComponent
 */
window.addEventListener("beforeunload", (event) => {
  if (localStorage.getItem("ownUserId") !== null) {
    api.delete(`/users/${localStorage.getItem("ownUserId")}`);
    localStorage.removeItem("ownUserId");
  } else {
    // Prevent the page from unloading
    event.preventDefault();
    
    return confirm;
  }
});

const Header = props => (
  <p></p>
);

Header.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default Header;
