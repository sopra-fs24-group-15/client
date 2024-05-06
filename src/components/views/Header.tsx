import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import "../../styles/views/Header.scss";
import { Spinner } from "components/ui/Spinner";

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

const Header = props => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchLobbys = async () => {
    try {
      await api.get("/lobbys");
      // Handle the response here...
      setIsLoading(false);

      return
    } catch (error) {
      // Handle the error here...
      if (localStorage.getItem("ownUserId") !== null) {
        api.delete(`/users/${localStorage.getItem("ownUserId")}`);
        localStorage.removeItem("ownUserId");
      }
      setTimeout(fetchLobbys, 2000); // Wait 1 second before retrying
      
    }
  };

  useEffect(() => {
    fetchLobbys();
  }, []);

  return (
    isLoading ? (
      <div className="header title">
        <h1>connecting to server</h1>
        <Spinner />
      </div>
    ) : null
  );
};

export default Header;