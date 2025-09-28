import { useState, useEffect } from "react";
import Live from "./Live";
import Fact from "./Fact";
import "./LiveList.css";
import axios from "axios";

export default function LiveList() {
  const [fetchedData, setFetchedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(process.env.REACT_APP_BACKEND + "live/")
        .then(function (response) {
          setFetchedData(response.data);
        })
        .catch(function (error) {
          if (error.response) {
            setError("There are no live matches to display");
          }
        });
    };
    getData();
  }, []);

  if (error) {
    return <h1 style={{ textAlign: 'center' }}>{error}</h1>;
  }

  if (!fetchedData) {
    return <Fact />;
  }

  return (
    <div>
      <h2 className="recent">
        Recent Games (Updates every 10 minutes if a game is live):{" "}
      </h2>
      {fetchedData &&
        fetchedData.map((value, idx) => <Live key={idx} gameData={value} />)}
    </div>
  );
}
