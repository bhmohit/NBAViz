import "./Navbar.css";
import Search from "./Search";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="branding">
        <h1>🏀 NBAViz</h1>
      </div>
      <div className="pages">
        <ul>
          <a href="/">Home</a>
          <a href="/players">Players</a>
          <a href="/teams">Teams</a>
          <a href="/matches">Matches</a>
        </ul>
      </div>
      <div>
        <Search/>
      </div>
    </div>
  );
}