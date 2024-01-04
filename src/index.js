import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthWrapper } from "./context/AuthWrapper";
import { SelectionWrapper } from "./context/SelectionWrapper";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <SelectionWrapper>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </SelectionWrapper>
      </AuthWrapper>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
