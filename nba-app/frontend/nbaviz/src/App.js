import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {useLoaderData} from "react-router-dom"
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function App() {
  const fetchedData = useLoaderData();

  return (
    <div>
      <h1> 10 Random Players </h1>
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {fetchedData.map((value) => (
              <Grid key={value} item>
                <Card sx={{ maxWidth: 260 }}>
                  <CardActionArea href={`/player/${value["id"]}`}>
                    <CardMedia>
                      <img
                      height={190}
                      width={260}
                        src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${value["id"]}.png`}
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
  );
}
