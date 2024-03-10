import React from "react";
import ReactDOM from "react-dom/client";
import Data from "./Data";
import List from "./List";
import Home from "./Home";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Navbar from "./Navbar";

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
        errorElement: (
          <Alert severity="error">
            Error, please try creating a GitHub Issue to describe the error
          </Alert>
        ),
      },
      {
        path: "/team/:id",
        element: <Data type={"team"} />,
        errorElement: (
          <Alert severity="error">
            Error, please try creating a GitHub Issue to describe the error
          </Alert>
        ),
      },
      {
        path: "/",
        element: <Home />,
        errorElement: (
          <Alert severity="error">
            Error, please try creating a GitHub Issue to describe the error
          </Alert>
        ),
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
        errorElement: (
          <Alert severity="error">
            Error, please try creating a GitHub Issue to describe the error
          </Alert>
        ),
      },
    ],
  },
]);
root.render(<RouterProvider router={router} />);
