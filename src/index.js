import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import 'remixicon/fonts/remixicon.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);