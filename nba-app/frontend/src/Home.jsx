import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import List from "./List";
import "./Home.css";
import axios from "axios";
import Live from "./Live";
import Fact from "./Fact";

export default function Home() {
  const history = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [fetchedData, setFetchedData] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    history(`/search/${inputValue}`);
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(process.env.REACT_APP_BACKEND + "live/")
        .then(function (response) {
          setFetchedData(response.data);
        })
        .catch(function (error) {
          if (error.response) console.log(error);
        });
    };
    getData();
  }, []);

  if (!fetchedData) {
    return <Fact />;
  }

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
      <h2 className="recent">Recent Games: </h2>
        {fetchedData.map((value, idx) => {
          return <Live key={idx} gameData={value} />;
        })}
    </div>
  );
}
