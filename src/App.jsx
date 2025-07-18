import { useState, useEffect } from "react";
import "./App.css";
import Home from './Home/Home';
import Nav from "./Nav/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CountryProvider } from "./context/CountryProvider";
import CountryDetail from "./Home/home-details/HomeDetails";



function App() {
  const getPreferredTheme = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;  

  const [darkMode, setDarkMode] = useState(false);


   useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(getPreferredTheme());
    }
  }, []);

  // Save on toggle
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <CountryProvider>

        
        <Nav darkMode={darkMode} setDarkMode={setDarkMode} />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/country/:name" element={<CountryDetail/>} />
          </Routes>
        </BrowserRouter>
      </CountryProvider>
    </div>
  );
}

export default App;
