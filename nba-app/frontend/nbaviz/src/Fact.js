import { useState, useEffect } from "react";
import axios from "axios";
export default function Fact() {
  const [fact, setFact] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const getData = () => {
      axios
        .get("https://api.api-ninjas.com/v1/facts?limit=1", {
          signal: controller.signal,
          headers: {
            'X-Api-Key': 'mAtRHJk9uwPHyqlENnnm7g==7rvsCh26pYbXd8on'
          },
        })
        .then((responses) => setFact(responses.data));
    };
    getData();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    fact && (
      <div>
        {fact.map((value) => (
          <div>{value.fact}</div>
        ))}
      </div>
    )
  );
}
