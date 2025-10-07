import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Compare.css";
import Fact from "./Fact";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Radar, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Compare(props) {
  const [entity1Data, setEntity1Data] = useState(null);
  const [entity2Data, setEntity2Data] = useState(null);
  const [allEntities, setAllEntities] = useState([]);
  const [selectedEntity1, setSelectedEntity1] = useState("");
  const [selectedEntity2, setSelectedEntity2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { type } = useParams();
  
  const imageUrlPre =
    type === "team"
      ? "https://cdn.nba.com/logos/nba/"
      : "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/";
  const imageUrlPost = type === "team" ? "/global/L/logo.svg" : ".png";

  // Load all players/teams on mount
  useEffect(() => {
    const fetchAllEntities = async () => {
      try {
        const endpoint = type === "player" ? "all-players" : "all-teams";
        const response = await axios.get(
          process.env.REACT_APP_BACKEND + endpoint
        );
        setAllEntities(response.data);
      } catch (error) {
        console.error("Error fetching entities:", error);
      }
    };
    fetchAllEntities();
  }, [type]);

  const handleCompare = async () => {
    if (!selectedEntity1 || !selectedEntity2) {
      setError("Please select two " + (type === "player" ? "players" : "teams") + " to compare");
      return;
    }

    if (selectedEntity1 === selectedEntity2) {
      setError("Please select different " + (type === "player" ? "players" : "teams"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND +
          `compare/${type}/${selectedEntity1}/${selectedEntity2}/`
      );
      setEntity1Data(response.data.entity1.data);
      setEntity2Data(response.data.entity2.data);
    } catch (error) {
      setError("Error loading comparison data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverages = (data) => {
    const stats = data;
    const pts = stats.PTS.reduce((a, b) => a + b, 0) / stats.PTS.length;
    const reb = stats.REB.reduce((a, b) => a + b, 0) / stats.REB.length;
    const ast = stats.AST.reduce((a, b) => a + b, 0) / stats.AST.length;
    const stl = stats.STL.reduce((a, b) => a + b, 0) / stats.STL.length;
    const blk = stats.BLK.reduce((a, b) => a + b, 0) / stats.BLK.length;
    const eff = stats.EFF.reduce((a, b) => a + b, 0) / stats.EFF.length;

    return {
      pts: pts.toFixed(1),
      reb: reb.toFixed(1),
      ast: ast.toFixed(1),
      stl: stl.toFixed(1),
      blk: blk.toFixed(1),
      eff: eff.toFixed(1),
    };
  };

  if (loading) {
    return <Fact />;
  }

  // Radar Chart Data
  const getRadarData = () => {
    if (!entity1Data || !entity2Data) return null;

    const avg1 = calculateAverages(entity1Data);
    const avg2 = calculateAverages(entity2Data);

    return {
      labels: ["Points", "Rebounds", "Assists", "Steals", "Blocks", "Efficiency"],
      datasets: [
        {
          label: entity1Data.NAME,
          data: [avg1.pts, avg1.reb, avg1.ast, avg1.stl, avg1.blk, avg1.eff],
          backgroundColor: "rgba(102, 126, 234, 0.2)",
          borderColor: "rgba(102, 126, 234, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(102, 126, 234, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(102, 126, 234, 1)",
        },
        {
          label: entity2Data.NAME,
          data: [avg2.pts, avg2.reb, avg2.ast, avg2.stl, avg2.blk, avg2.eff],
          backgroundColor: "rgba(118, 75, 162, 0.2)",
          borderColor: "rgba(118, 75, 162, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(118, 75, 162, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(118, 75, 162, 1)",
        },
      ],
    };
  };

  // Bar Chart Data for Career Stats
  const getBarData = () => {
    if (!entity1Data || !entity2Data) return null;

    const avg1 = calculateAverages(entity1Data);
    const avg2 = calculateAverages(entity2Data);

    return {
      labels: ["Points", "Rebounds", "Assists", "Steals", "Blocks"],
      datasets: [
        {
          label: entity1Data.NAME,
          data: [avg1.pts, avg1.reb, avg1.ast, avg1.stl, avg1.blk],
          backgroundColor: "rgba(102, 126, 234, 0.8)",
          borderColor: "rgba(102, 126, 234, 1)",
          borderWidth: 2,
          borderRadius: 10,
        },
        {
          label: entity2Data.NAME,
          data: [avg2.pts, avg2.reb, avg2.ast, avg2.stl, avg2.blk],
          backgroundColor: "rgba(118, 75, 162, 0.8)",
          borderColor: "rgba(118, 75, 162, 1)",
          borderWidth: 2,
          borderRadius: 10,
        },
      ],
    };
  };

  // Line Chart for Points Over Time
  const getPointsOverTimeData = () => {
    if (!entity1Data || !entity2Data) return null;

    return {
      labels: entity1Data.LABELS,
      datasets: [
        {
          label: entity1Data.NAME + " - Points",
          data: entity1Data.PTS,
          borderColor: "rgba(102, 126, 234, 1)",
          backgroundColor: "rgba(102, 126, 234, 0.2)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
        {
          label: entity2Data.NAME + " - Points",
          data: entity2Data.PTS,
          borderColor: "rgba(118, 75, 162, 1)",
          backgroundColor: "rgba(118, 75, 162, 0.2)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
        },
        pointLabels: {
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      title: {
        display: true,
        text: "Career Averages Comparison",
        font: {
          size: 18,
          weight: "700",
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      title: {
        display: true,
        text: "Average Stats Comparison",
        font: {
          size: 18,
          weight: "700",
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      title: {
        display: true,
        text: "Points Over Time",
        font: {
          size: 18,
          weight: "700",
        },
      },
    },
  };

  return (
    <div className="compare-container">
      <div className="compare-header">
        <h1 className="compare-title">
          Compare {type === "player" ? "Players" : "Teams"}
        </h1>
        <p className="compare-subtitle">
          Select two {type === "player" ? "players" : "teams"} to compare their
          statistics
        </p>
      </div>

      <div className="selector-section">
        <div className="selector-wrapper">
          <label htmlFor="entity1">
            {type === "player" ? "Player" : "Team"} 1
          </label>
          <select
            id="entity1"
            value={selectedEntity1}
            onChange={(e) => setSelectedEntity1(e.target.value)}
            className="entity-selector"
          >
            <option value="">
              Select {type === "player" ? "a player" : "a team"}
            </option>
            {allEntities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="vs-divider">VS</div>

        <div className="selector-wrapper">
          <label htmlFor="entity2">
            {type === "player" ? "Player" : "Team"} 2
          </label>
          <select
            id="entity2"
            value={selectedEntity2}
            onChange={(e) => setSelectedEntity2(e.target.value)}
            className="entity-selector"
          >
            <option value="">
              Select {type === "player" ? "a player" : "a team"}
            </option>
            {allEntities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleCompare} className="compare-button">
        Compare
      </button>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {entity1Data && entity2Data && (
        <div className="comparison-results">
          {/* Entity Cards */}
          <div className="entity-cards">
            <div className="entity-card">
              <img
                src={imageUrlPre + selectedEntity1 + imageUrlPost}
                onError={(e) =>
                  (e.target.src =
                    "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png")
                }
                alt={entity1Data.NAME}
                className="entity-image"
              />
              <h3>{entity1Data.NAME}</h3>
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">PPG</span>
                  <span className="stat-value">
                    {calculateAverages(entity1Data).pts}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">RPG</span>
                  <span className="stat-value">
                    {calculateAverages(entity1Data).reb}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">APG</span>
                  <span className="stat-value">
                    {calculateAverages(entity1Data).ast}
                  </span>
                </div>
              </div>
            </div>

            <div className="entity-card">
              <img
                src={imageUrlPre + selectedEntity2 + imageUrlPost}
                onError={(e) =>
                  (e.target.src =
                    "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png")
                }
                alt={entity2Data.NAME}
                className="entity-image"
              />
              <h3>{entity2Data.NAME}</h3>
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">PPG</span>
                  <span className="stat-value">
                    {calculateAverages(entity2Data).pts}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">RPG</span>
                  <span className="stat-value">
                    {calculateAverages(entity2Data).reb}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">APG</span>
                  <span className="stat-value">
                    {calculateAverages(entity2Data).ast}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-container">
              <Radar data={getRadarData()} options={radarOptions} />
            </div>

            <div className="chart-container">
              <Bar data={getBarData()} options={barOptions} />
            </div>

            <div className="chart-container chart-full-width">
              <Line data={getPointsOverTimeData()} options={lineOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
