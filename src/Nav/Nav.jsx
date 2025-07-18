import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "./Nav.css";



const Nav = ({ darkMode, setDarkMode }) => {
  return (
    <header className="nav-header">
      <h1>Where in the world?</h1>
      <button
        className="mode-toggle-btn"
        onClick={() => setDarkMode(prev => !prev)}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
        <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
      </button>
    </header>
  );
};

export default Nav;
