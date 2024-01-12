import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import FileDisplay from "./FileDisplay";
import { useAuth } from "../context/AuthWrapper";
import ConfirmButton from "../components/ConfirmButton";
import { useSelection } from "../context/SelectionWrapper";
import API from "../api";

const { Title } = Typography;

// setRenderCallback is here in case we want to allow for choosing photos here. By right, we should.
const FolderView = ({ unselected, selected, setRenderCallback }) => {
  const navigate = useNavigate();
  const { selection, resetSelection } = useSelection();
  const [toggle, setToggle] = useState(false);
  const [isSelectionView, setIsSelectionView] = useState(true);
  const [display, setDisplay] = useState(unselected);
  const { user } = useAuth();

  useEffect(() => {
    if (isSelectionView) {
      setDisplay(unselected);
    } else {
      setDisplay(selected);
    }
    resetSelection();
  }, [isSelectionView]);

  const handleConfirmation = async () => {
    const headers = { accesscode: user.code, email: user.email };
    if (selection.length <= 0) {
      alert("Please select 1 or more photos!");
      return;
    }

    if (isSelectionView) {
      const res = await API.addSelectedPhotos(selection, headers);
      if (res.success) {
        alert("Successfully added photos to edit list!");
      }
    } else {
      const res = await API.removeSelectedPhotos(selection, headers);
      if (res.success) {
        alert("Successfully removed photos from edit list!");
      }
    }
    setRenderCallback(Math.random());
    navigate("../");
  };

  const handleReset = () => {
    setToggle(!toggle);
    resetSelection();
  };

  if (display === "") {
    return <Navigate to="/view" />;
  }

  const currentRoute = window.location.pathname;
  const folderName = currentRoute.split("/").pop();

  const toggleSelection = () => {
    setIsSelectionView(!isSelectionView);
  };

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <Title level={2}>
        You are currently {isSelectionView ? "SELECTING for" : "REMOVING from"}{" "}
        editting
      </Title>
      <Button type="primary" onClick={() => toggleSelection()}>
        Toggle Mode
      </Button>
      <Row gutter={[16, 16]} justify="center">
        {display[folderName].length === 0
          ? null
          : display[folderName].map((file) => {
              return (
                <Col key={file}>
                  <FileDisplay
                    folderName={folderName}
                    fileName={file}
                    resetSelection={toggle}
                  />
                </Col>
              );
            })}
      </Row>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <ConfirmButton
          resetSelection={handleReset}
          handleConfirmation={handleConfirmation}
          msg={isSelectionView ? "select" : "remove"}
        />
      </div>
    </div>
  );
};

export default FolderView;
