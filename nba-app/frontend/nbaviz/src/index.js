import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Player from "./Player";
import App from "./App";
import { createBrowserRouter, RouterProvider, defer } from "react-router-dom";
import Alert from "@mui/material/Alert";
import axios from "axios";

const getDataForApp = async () => {
  const response = await axios.get(`http://localhost:8000/home/`);
  return response.data;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    path: "/player/:playerID",
    element: <Player />,
    errorElement: (
      <Alert severity="error">Error, please try creating a GitHub Issue to describe the error</Alert>
    ),
  },
  {
    path: "/",
    element: <App />,
    loader: getDataForApp,
    errorElement: (
      <Alert severity="error">Error, please try creating a GitHub Issue to describe the error</Alert>
    ),
  },
]);
root.render(<RouterProvider router={router} />);