import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import FileDisplay from "./FileDisplay";
import ConfirmButton from "../components/ConfirmButton";
import API from "../api";
import { useSelection } from "../context/SelectionWrapper";
import { useAuth } from "../context/AuthWrapper";

const { Title } = Typography;

// setRenderCallback is here in case we want to allow for choosing photos here. By right, we should.
const FolderView = ({ accessible, selectedAccessible, setRenderCallback }) => {
  const navigate = useNavigate();
  const { selection, resetSelection } = useSelection();
  const [toggle, setToggle] = useState(false);
  const { user } = useAuth();
  const [isSelected, setIsSelected] = useState(false);
  const [display, setDisplay] = useState(accessible);

  useEffect(() => {
    if (isSelected) {
      setDisplay(selectedAccessible);
    } else {
      setDisplay(accessible);
    }
    resetSelection();
  }, [isSelected]);

  const handleConfirmation = async () => {
    if (selection.length <= 0) {
      alert("Please select 1 or more photos!");
      return;
    }

    const headers = { accesscode: user.code, email: user.email };
    const data = { isSelected: isSelected, selection: selection };
    const resp = await API.moveFiles(data, headers);

    if (resp.success) {
      isSelected
        ? alert("Successfully removed from Selected Photos")
        : alert("Successfully moved to Selected Photos");
    } else {
      alert("Encountered an error - please try again.");
    }
    //console.log("Setting renderCallback");
    setRenderCallback(Math.random());
    navigate("../");
  };

  const handleReset = () => {
    setToggle(!toggle);
    resetSelection();
  };

  if (accessible === "") {
    return <Navigate to="/view" />;
  }

  const currentRoute = window.location.pathname;
  const folderName = currentRoute.split("/").pop();

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      style={{ textAlign: "center", position: "relative", margin: "0 260px" }}
    >
      <Title level={2}>
        You are currently {!isSelected ? "SELECTING for" : "REMOVING from"}{" "}
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
                    isSelect={isSelected}
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
          msg={isSelected ? "remove" : "select"}
        />
      </div>
    </div>
  );
};

export default FolderView;
