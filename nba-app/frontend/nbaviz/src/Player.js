import axios from "axios";
import "./Player.css";
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
import Fact from "./Fact";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Player() {
  const [fetchedData, setFetchedData] = useState(null);
  let { playerID } = useParams();
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `http://localhost:8000/players/${playerID}`
      );
      setFetchedData(response.data.data);
    };
    getData();
  }, []);

  let data = {};
  let name = "";

  if (fetchedData) {
    let labels = fetchedData["LABELS"];
    name = fetchedData["NAME"];
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
  if (!fetchedData) {
    return (
      <div>
        <p>
          Loading... (This might take a while) Heres a random fact in the mean
          time
        </p>
        <Fact />
      </div>
    );
  }
  return (
    <div className="main-container">
      {fetchedData && (
        <div className="main">
          <img
            height={190}
            width={260}
            src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${playerID}.png`}
            onError={(e) =>
              (e.target.src =
                "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png")
            }
            alt="Player"
          />
          {name}
          <div className="line-wrapper">
            <Line options={options} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
