import React from "react";
import { Typography } from "antd";
import FormModal from "../components/FormModal";
import CodeBox from "../components/CodeBox";
import "../App.css";

const { Title } = Typography;

export const Login = () => {
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
