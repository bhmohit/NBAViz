import Grid from "@mui/material/Grid";
import "./Live.css";

export default function Live(props) {
  const gameData = props.gameData;
  const gameStatus = gameData["gameStatusText"];
  const homeTeamData = gameData["homeTeam"];
  const awayTeamData = gameData["awayTeam"];
  const periods = gameData["periods"];
  
  return (
    <div className="parent">
      <Grid container spacing={0} className="main">
        <Grid item xs>
          <div className="image">
            <img
              src={`https://cdn.nba.com/logos/nba/${homeTeamData["teamID"]}/global/L/logo.svg`}
            />
            <div>{homeTeamData["teamName"]}</div>
            <div>
              ({homeTeamData["wins"]}-{homeTeamData["losses"]})
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="middle">
            <div className="status">{gameStatus}</div>
            <div className="data">
              <span className="score">{homeTeamData["score"]}</span>
              <span className="score">{awayTeamData["score"]}</span>
            </div>
            <div className="periods">
              {periods.map((value, idx) => (
                <span key={idx}>
                  <b>
                    {idx + 1}
                    <sup>st</sup>
                  </b>
                  {value}
                </span>
              ))}
            </div>
          </div>
        </Grid>
        <Grid item xs>
          <div className="image">
            <img
              src={`https://cdn.nba.com/logos/nba/${awayTeamData["teamID"]}/global/L/logo.svg`}
            />
            <div>{awayTeamData["teamName"]}</div>
            <div>
              ({awayTeamData["wins"]}-{awayTeamData["losses"]})
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
