# NBAViz


## Currently Working On:

- Making the front end pretty.
- Reducing page load time for data that has not been cached.

## How To Setup:
- Step 1: Install Redis
  - Installation guide: https://redis.io/docs/getting-started/

- Step 2: Run Redis
  - Once installed, run redis on **port 6379**(default) using the `redis-server` command

- Step 3: Install dependencies for backend
  - Run the setup.sh file on Linux/macOS using `./setup.sh` or `setup.bat` on Windows

- Step 4: Run the backend
  - Navigate to the directory containing manage.py and run `python3 manage.py runserver` to start the server on **port 8000**

- Step 5: Run the frontend
  - Navigate to the frontend/nbaviz directory and run `npm install` and then `npm start`
