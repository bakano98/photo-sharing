import React, { useState, useEffect } from "react";
import FileDisplay from "./FileDisplay";
import { Row, Col } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelection } from "../context/SelectionWrapper";
import { useAuth } from "../context/AuthWrapper";
import ConfirmButton from "../components/ConfirmButton";
import "./PhotosView.css"; // Import the updated CSS file for styling
import API from "../api";

const MainPhotosView = ({
  accessibleFolders,
  accessible,
  isSelect,
  setRenderCallback,
}) => {
  const navigate = useNavigate();
  const { selection, resetSelection } = useSelection();
  const { user } = useAuth();
  const [toggle, setToggle] = useState(false);
  const handleConfirmation = async () => {
    if (selection.length <= 0) {
      alert("Please select 1 or more photos!");
      return;
    }

    const headers = { accesscode: user.code, email: user.email };
    const data = { isSelected: isSelect, selection: selection };
    const resp = await API.moveFiles(data, headers);

    if (resp.success) {
      isSelect
        ? alert("Successfully removed from Selected Photos")
        : alert("Successfully moved to Selected Photos");
    } else {
      alert("Encountered an error - please try again.");
    }
    navigate("../");
    setRenderCallback(Math.random());
  };

  useEffect(() => {
    resetSelection();
  }, []);

  const handleReset = () => {
    setToggle(!toggle);
    resetSelection();
  };

  if (accessibleFolders === "") {
    return <Navigate to="/view" />;
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <Row gutter={[16, 16]} justify="center">
        {accessibleFolders.map((folder) =>
          accessible[folder].map((file) => (
            <Col key={file}>
              <FileDisplay
                key={`${folder}-${file}`}
                folderName={folder}
                fileName={file}
                isSelect={isSelect}
                resetSelection={toggle}
              />
            </Col>
          ))
        )}
      </Row>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <ConfirmButton
          resetSelection={handleReset}
          handleConfirmation={handleConfirmation}
          msg={isSelect ? "remove" : "select"}
        />
      </div>
    </div>
  );
};

export default MainPhotosView;
