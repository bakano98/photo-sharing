import React, { useState, useEffect } from "react";
import FileDisplay from "./FileDisplay";
import { Row, Col } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelection } from "../context/SelectionWrapper";
import ConfirmButton from "../components/ConfirmButton";
import { useAuth } from "../context/AuthWrapper";
import API from "../api";
import "./PhotosView.css"; // Import the updated CSS file for styling

const MainPhotosView = ({
  accessibleFolders,
  photos,
  isSelectionView,
  setRenderCallback,
}) => {
  const navigate = useNavigate();
  const { selection, resetSelection } = useSelection();
  const [toggle, setToggle] = useState(false);
  const { user } = useAuth();

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
        {accessibleFolders.map((folder) => {
          if (photos[folder]) {
            return photos[folder].map((file) => (
              <Col key={file}>
                <FileDisplay
                  key={`${folder}-${file}`}
                  folderName={folder}
                  fileName={file}
                  isSelect={isSelectionView}
                  resetSelection={toggle}
                />
              </Col>
            ));
          } else {
            return "";
          }
        })}
      </Row>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <ConfirmButton
          resetSelection={handleReset}
          handleConfirmation={handleConfirmation}
          msg={isSelectionView ? "remove" : "select"}
        />
      </div>
    </div>
  );
};

export default MainPhotosView;
