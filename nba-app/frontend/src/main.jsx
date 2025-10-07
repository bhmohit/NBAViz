import React from "react";
import ReactDOM from "react-dom/client";
import Data from "./Data";
import List from "./List";
import Home from "./Home";
import Compare from "./Compare";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Navbar from "./Navbar";
import LiveList from "./LiveList";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
const HeaderLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <Outlet />
  </>
);
const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/player/:id",
        element: <Data type={"player"} />,
      },
      {
        path: "/players",
        element: (
          <List
            url={`home/player`}
            type={"player"}
            hasParams={false}
            loadFact={false}
            noDataMessage="Players could not be retrieved"
            title="10 Random Players (Refresh for More)"
          />
        ),
      },
      {
        path: "/teams",
        element: (
          <List
            url={`home/team`}
            type={"team"}
            hasParams={false}
            loadFact={false}
            noDataMessage="Teams could not be retrieved"
            title="5 Random Teams (Refresh for More)"
          />
        ),
      },
      {
        path: "/matches",
        element: <LiveList />,
      },
      {
        path: "/team/:id",
        element: <Data type={"team"} />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/compare/:type",
        element: <Compare />,
      },
      {
        path: "/search/:playerName",
        element: (
          <List
            url={`search`}
            type={"player"}
            loadFact={true}
            noDataMessage="Could not find player"
            hasParams={true}
            title={"Results for"}
          />
        ),
      },
    ],
    errorElement: (
      <Alert severity="error">
        Error, please try creating a GitHub Issue to describe the error
      </Alert>
    ),
  },
]);
root.render(<RouterProvider router={router} />);
