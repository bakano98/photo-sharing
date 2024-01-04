import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import FormModal from "../components/FormModal";
import CodeBox from "../components/CodeBox";
import "../App.css";

const { Title } = Typography;

export const Login = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  if (loading) {
    return <h1 style={{ textAlign: "center" }}> Loading... </h1>;
  }

  return (
    <div className="App">
      <div className="header-container">
        <Title className="header-title">Welcome!</Title>
      </div>
      <div className="codebox-container">
        <CodeBox />
      </div>
      <FormModal />
    </div>
  );
};
