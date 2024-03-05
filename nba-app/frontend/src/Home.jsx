import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "./List";
import "./Home.css";

export default function Home() {
  const history = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    history(`/search/${inputValue}`);
  };

  return (
    <div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="input"> Search for a player </label>
          <input
            type="text"
            id="input"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <List
        url={`home/player`}
        type={"player"}
        hasParams={false}
        loadFact={false}
        noDataMessage="Players could not be retrieved"
        title="10 Random Players (Refresh for More)"
      />
      <List
        url={`home/team`}
        type={"team"}
        hasParams={false}
        loadFact={false}
        noDataMessage="Teams could not be retrieved"
        title="5 Random Teams (Refresh for More)"
      />
    </div>
  );
}
