import axios from "axios";
import "./Data.css";
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

export default function Data(props) {
  const [fetchedData, setFetchedData] = useState(null);
  const { id } = useParams();
  const [throwError, setThrowError] = useState(false);
  const type = props.type;
  const imageUrlPre =
    props.type === "team"
      ? "https://cdn.nba.com/logos/nba/"
      : "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/";
  const imageUrlPost = props.type === "team" ? "/global/L/logo.svg" : ".png";

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(process.env.REACT_APP_BACKEND + `data/${type}/${id}/`)
        .then(function (response) {
          setFetchedData(response.data.data);
        })
        .catch(function (error) {
          setThrowError(true);
          if (error.response) console.log(error);
        });
    };
    getData();
  }, [id]);

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
          borderColor: "rgb(255, 99, 71)",
          backgroundColor: "rgba(255, 99, 71, 0.5)",
        },
        {
          label: "Points",
          data: fetchedData["PTS"],
          borderColor: "rgb(0, 128, 0)",
          backgroundColor: "rgba(0, 128, 0, 0.5)",
        },
        {
          label: "Rebounds",
          data: fetchedData["REB"],
          borderColor: "rgb(70, 130, 180)",
          backgroundColor: "rgba(70, 130, 180, 0.5)",
        },
        {
          label: "Assists",
          data: fetchedData["AST"],
          borderColor: "rgb(255, 165, 0)",
          backgroundColor: "rgba(255, 165, 0, 0.5)",
        },
        {
          label: "Steals",
          data: fetchedData["STL"],
          borderColor: "rgb(128, 0, 128)",
          backgroundColor: "rgba(128, 0, 128, 0.5)",
        },
        {
          label: "Blocks",
          data: fetchedData["BLK"],
          borderColor: "rgb(0, 0, 139)",
          backgroundColor: "rgba(0, 0, 139, 0.5)",
        },
      ],
    };
  } else {
    if (throwError) {
      return <h1>Insufficient data has been recorded on this player</h1>;
    }
    return (
      <div>
        <Fact />
      </div>
    );
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

  return (
    <div className="main-container">
      {fetchedData && (
        <div>
          <img
            className="playerImg"
            height={190}
            width={260}
            src={imageUrlPre + id + imageUrlPost}
            onError={(e) =>
              (e.target.src =
                "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png")
            }
            alt="Player"
          />
          <div>
            <Line options={options} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}