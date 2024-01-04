import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col } from "antd";
import { Navigate } from "react-router-dom";
import FileDisplay from "./FileDisplay";

const { Title } = Typography;

// setRenderCallback is here in case we want to allow for choosing photos here. By right, we should.
const FolderView = ({ accessible, selectedAccessible, setRenderCallback }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [display, setDisplay] = useState(accessible);
  useEffect(() => {
    if (isSelected) {
      setDisplay(selectedAccessible);
    } else {
      setDisplay(accessible);
    }
  }, [isSelected]);

  if (accessible === "") {
    return <Navigate to="/view" />;
  }

  const currentRoute = window.location.pathname;
  const folderName = currentRoute.split("/").pop();

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };
  console.log(display[folderName]);
  return (
    <div
      style={{ textAlign: "center", position: "relative", margin: "0 250px" }}
    >
      <Title level={3}>
        Showing {isSelected ? "selected" : "remaining"} photos in {folderName}:
      </Title>
      <Button type="primary" onClick={() => toggleSelection()}>
        Toggle Selection
      </Button>
      <Row gutter={[16, 16]} justify="center">
        {display[folderName].length === 0
          ? null
          : display[folderName].map((file) => {
              console.log(file);
              return (
                <Col key={file}>
                  <FileDisplay
                    folderName={folderName}
                    fileName={file}
                    isSelect={isSelected}
                  />
                </Col>
              );
            })}
      </Row>
    </div>
  );
};

export default FolderView;
