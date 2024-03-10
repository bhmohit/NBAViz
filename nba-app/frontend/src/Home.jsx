import List from "./List";
import LiveList from "./LiveList";

export default function Home() {
  return (
    <div>
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
