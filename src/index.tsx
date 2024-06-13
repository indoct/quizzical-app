import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { router } from "./router";
import "./App.css";

const root = document.getElementById("root")!;
ReactDOM.createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
