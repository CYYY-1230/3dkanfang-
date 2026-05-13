import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HouseDataProvider } from "./context/HouseDataContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HouseDataProvider>
        <App />
      </HouseDataProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
