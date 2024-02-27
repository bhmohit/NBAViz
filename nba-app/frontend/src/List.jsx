import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./List.css";
import Fact from "./Fact";

export default function List(props) {
  const [fetchedData, setFetchedData] = useState(null);
  const [throwError, setThrowError] = useState(false);
  const { playerName } = useParams();
  let url = props.url;
  let title = props.title;
  const imageUrlPre = props.type === "team" ? "https://cdn.nba.com/logos/nba/" : "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/"
  const imageUrlPost = props.type === "team" ? "/global/L/logo.svg" : ".png"
  
  if (props.hasParams) {
    url = url + "/" + playerName + "/";
    title = title + " " + playerName;
  }

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`http://localhost:80/${url}`)
        .then(function (response) {
          setFetchedData(response.data);
        })
        .catch(function (error) {
          setThrowError(true);
          if (error.response) console.log(error);
        });
    };
    getData();
  }, []);

  if (!fetchedData) {
    if (throwError) {
      return <h1>{props.noDataMessage}</h1>;
    }
    return (
      <div>
        {props.loadFact ? (
          <div>
            <p>Loading... Heres a random fact in the mean time:</p>
            <Fact />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  return (
    <div>
      {fetchedData && (
        <div>
          <h2 className="title"> {title} </h2>
          <Grid sx={{ flexGrow: 1 }} container spacing={2}>
            <Grid item xs={12}>
              <Grid container justifyContent="center" spacing={2}>
                {fetchedData.map((value) => (
                  <Grid key={value} item>
                    <Card sx={{ maxWidth: 260 }}>
                      <CardActionArea href={`/${props.type}/${value["id"]}`}>
                        <CardMedia>
                          <img
                            height={190}
                            width={260}
                            src={imageUrlPre + value["id"] + imageUrlPost}
                            onError={(e) =>
                              (e.target.src =
                                "https://global.discourse-cdn.com/turtlehead/original/2X/c/c830d1dee245de3c851f0f88b6c57c83c69f3ace.png")
                            }
                          />
                        </CardMedia>
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {value["full_name"]}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
