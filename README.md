# NBAViz 🏀

## Demo 📹
![Video](https://github.com/bhmohit/NBAViz/blob/main/app.gif)

## Challenges Faced ⚠️ -- NOT CURRENT ISSUES
- The application relies on an API that scrapes data from stats.nba.com, making running on a cloud-hosted machine challenging without incurring additional costs for a proxy. This obstacle arises from the rate limitations imposed on IP addresses associated with cloud providers such as AWS, DigitalOcean.

##Deployment information
- To address challenges with data fetching, I deployed the API locally on a Raspberry Pi and used Cloudflare Tunnels to enable secure outbound connections to the Pi.
- I bundled the frontend and backend applications, serving them under the same domain using NGINX.
- The complete application was deployed on an Amazon EC2 instance for scalability and accessibility.

## Features 🚀

- Explore NBA player and team data (over the past 30 years) with intuitive graphical representations.
- Easily search for specific players.
- View latest game data

## Technical Description 💻

- Predictions leverage ARIMA, a time-series forecasting model that determines future outcomes based on historical data.
- Frontend developed using React, Material UI, and Chart.js for a user interface.
- Backend powered by Django (Python) for robust functionality.
- Redis utilized for caching previously generated predictions.
- Nginx, employed as a reverse proxy, and Gunicorn serve the Django app efficiently.
- Docker employed to containerize the application for seamless deployment.

## How To Setup Locally ⚙️

- **Step 1:** Set up the Docker image and run the container
  - Run `docker compose up`
  - To get docker check out: https://docs.docker.com/get-docker/
- **Step 2:** Visit localhost:5173 in your browser.

## Future Improvements 🚧

- Explore alternative methods for predicting user data, addressing potential challenges, such as the first season edge case where no predictions may be available.
