import Grid from "@mui/material/Grid";
import "./Live.css";

export default function Live() {
  return (
    <Grid container spacing={0}>
      <Grid item xs>
        <div className="image">
          <img
            className="homeTeamImage"
            src="https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg"
          />
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className="middle">
          <span className="score">255</span>
          <span className="separator">-</span>
          <span className="score">255</span>
        </div>
      </Grid>
      <Grid item xs>
        <div className="image">
          <img
            className="awayTeamImage"
            src="https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg"
          />
        </div>
      </Grid>
    </Grid>
  );
}
