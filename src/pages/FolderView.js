// FolderView.js
import React, { useState } from "react";
import { Typography } from "antd";
import { Navigate } from "react-router-dom";
import FileDisplay from "./FileDisplay";

const { Title } = Typography;

const FolderView = ({ accessible }) => {
  const [isSelected, setIsSelected] = useState(true);
  if (accessible == "") {
    return <Navigate to="/view" />;
  }
  const currentRoute = window.location.pathname;
  const folderName = currentRoute.split("/").pop();

  return (
    <div>
      <h2>
        Showing {isSelected ? "selected" : "remaining"} photos in {folderName}:
      </h2>
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
