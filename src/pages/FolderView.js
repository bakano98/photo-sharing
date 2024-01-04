import React, { useState, useEffect } from "react";
import { Typography, Button } from "antd";
import { Navigate } from "react-router-dom";
import FileDisplay from "./FileDisplay";

const { Title } = Typography;

const FolderView = ({ accessible }) => {
  const [isSelected, setIsSelected] = useState(true);

  useEffect(() => {
    console.log("refresh");
  }, [isSelected]);

  if (accessible === "") {
    return <Navigate to="/view" />;
  }

  const currentRoute = window.location.pathname;
  const folderName = currentRoute.split("/").pop();

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div>
      <Title level={3}>
        Showing {isSelected ? "selected" : "remaining"} photos in {folderName}:
      </Title>
      <Button type="primary" onClick={() => toggleSelection()}>
        Toggle Selection
      </Button>
      {accessible[folderName].map((file) => (
        <FileDisplay
          key={file}
          folderName={folderName}
          fileName={file}
          isSelect={isSelected}
        />
      ))}
    </div>
  );
};

export default FolderView;
