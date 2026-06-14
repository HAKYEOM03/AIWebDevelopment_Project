import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ExamDataProvider } from "./context/ExamDataContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ExamDataProvider>
      <App />
    </ExamDataProvider>
  </React.StrictMode>
);
