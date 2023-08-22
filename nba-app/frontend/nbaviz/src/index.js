import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Player from "./Player";
import App from "./App"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
const router = createBrowserRouter([
  {
    
    
    path: "/player/:playerID",
    element: <Player />,
  },
  {
    path: '/',
    element: <App/>,  
  }
]);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
