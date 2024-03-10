import { useState, useEffect } from "react";
import Live from "./Live";
import Fact from "./Fact";
import "./LiveList.css";
import axios from "axios";

export default function LiveList() {
  const [fetchedData, setFetchedData] = useState(null);

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
      <h2 className="recent">
        Recent Games (Updates every 10 minutes if a game is live):{" "}
      </h2>
      {fetchedData &&
        fetchedData.map((value, idx) => <Live key={idx} gameData={value} />)}
    </div>
  );
}
