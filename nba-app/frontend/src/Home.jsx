import List from "./List";
import LiveList from "./LiveList";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1 className="hero-title">Welcome to NBAViz</h1>
        <p className="hero-subtitle">Explore NBA statistics, live games, and player insights</p>
      </section>
      <List
        url={`home/player`}
        type={"player"}
        hasParams={false}
        loadFact={false}
        noDataMessage="Players could not be retrieved"
        title="10 Random Players (Refresh for More)"
      />
      <List
        url={`home/team`}
        type={"team"}
        hasParams={false}
        loadFact={false}
        noDataMessage="Teams could not be retrieved"
        title="5 Random Teams (Refresh for More)"
      />
      <LiveList/>
    </div>
  );
}
