//import React from 'react';
import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  let { playerID } = useParams();
  const [fetchedData, setFetchedData] = useState(null);
  const getData = async () => {
    const response = await axios.get(
      `http://localhost:8000/players/${playerID}`
    );
    setFetchedData(response.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  let data = {}
  let name = ""
  
  if (fetchedData) {
    let labels = fetchedData["LABELS"]
    name = fetchedData["NAME"]
    data = {
      labels,
      datasets: [
        {
          label: "Player Efficiency",
          data: fetchedData["EFF"],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Points",
          data: fetchedData["PTS"],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Rebounds",
          data: fetchedData["REB"],
          borderColor: "rgb(92, 50, 168)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        {
          label: "Assists",
          data: fetchedData["AST"],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Steals",
          data: fetchedData["STL"],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Blocks",
          data: fetchedData["BLK"],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.25)",
        },
      ],
    };
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: name + " Statistics",
      },
    },
  };

  const imageString = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerID}.png`;
  return (
    <div className="main-container">
      {fetchedData && (
        <div className="main">
          <img alt="player-image" src={imageString} />
          {name}
          <div className="line-wrapper">
            <Line options={options} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
