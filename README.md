# NBAViz 🏀

## Features 🚀

- Explore NBA player and team data (over the past 30 years) with intuitive graphical representations.
- Easily search for specific players.

## Technical Description 💻

- Predictions leverage ARIMA, a time-series forecasting model that determines future outcomes based on historical data.
- Frontend developed using React, Material UI, and Chart.js for a user interface.
- Backend powered by Django (Python) for robust functionality.
- Redis utilized for caching previously generated predictions.
- Nginx, employed as a reverse proxy, and Gunicorn serve the Django app efficiently.
- Docker employed to containerize the application for seamless deployment.

## Currently Working On 🛠️

- Enhancing the aesthetics of the frontend.
- Integrating live/recent game data into the application.
- Deploying the application.

## How To Setup ⚙️

- **Step 1:** Set up the Docker image and run the container
  - Run `docker compose up`
  - To get docker check out: https://docs.docker.com/get-docker/
- **Step 2:** Visit localhost:5173 in your browser.

## Future Improvements 🚧

- Explore alternative methods for predicting user data, addressing potential challenges, such as the first season edge case where no predictions may be available.
