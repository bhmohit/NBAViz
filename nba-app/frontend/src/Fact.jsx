import "./Fact.css"
import CircularProgress from '@mui/material/CircularProgress';
import getFact from "myfacts";

export default function Fact() {
  const fact = getFact("Software").fact;
  
  return (
    fact && (
        <div className="mainContainer">
          <CircularProgress/>
          <p>Did you know: {fact}</p>
        </div>
    )
  );
}