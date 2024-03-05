import Grid from "@mui/material/Grid";
import "./Live.css";

export default function Live() {
  return (
    <div className="parent">
      <Grid container spacing={0} className="main">
        <Grid item xs>
          <img src="https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg" />
        </Grid>
        <Grid item xs={6}>
          <div className="middle">
            <div className="status">Final</div>
            <div className="data">
              <span className="score">255</span>
              <span className="score">255</span>
            </div>
            <div className="periods">
              <span><b>1<sup>st</sup></b> 25-28</span>
              <span><b>2<sup>st</sup></b> 25-28</span>
              <span><b>3<sup>st</sup></b> 25-28</span>
              <span><b>4<sup>st</sup></b> 25-28</span>
            </div>
          </div>
        </Grid>
        <Grid item xs>
          <img src="https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg" />
        </Grid>
      </Grid>
    </div>
  );
}
