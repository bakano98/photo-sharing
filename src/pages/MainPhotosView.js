import React, { useState, useEffect } from "react";
import FileDisplay from "./FileDisplay";
import { Row, Col } from "antd";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelection } from "../context/SelectionWrapper";
import ConfirmButton from "../components/ConfirmButton";
import { useAuth } from "../context/AuthWrapper";
import API from "../api";
import "./PhotosView.css";
import { useInView } from "react-intersection-observer"; // Import the hook

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

  const [maxFilesToShow, setMaxFilesToShow] = useState(10);
  const [filesToDisplay, setFilesToDisplay] = useState([]);
  const [ref, inView] = useInView(); // Hook to determine if an element is in view

  useEffect(() => {
    let concatenatedFiles = [];

    accessibleFolders.forEach((folder) => {
      if (photos[folder]) {
        concatenatedFiles = concatenatedFiles.concat(
          photos[folder].map((file) => ({ folder, file }))
        );
      }
    });

    setFilesToDisplay(concatenatedFiles.slice(0, maxFilesToShow));
  }, [accessibleFolders, photos, maxFilesToShow]);

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

  const increaseFilesToShow = () => {
    setMaxFilesToShow((prevMaxFiles) => prevMaxFiles + 10);
  };

  useEffect(() => {
    if (inView) {
      increaseFilesToShow();
    }
  }, [inView]);

  if (accessibleFolders === "") {
    return <Navigate to="/view" />;
  }

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <Row gutter={[16, 16]} justify="center">
        {filesToDisplay.map(({ folder, file }, index) => (
          <Col key={`${folder}-${file}`}>
            {index === filesToDisplay.length - 1 && (
              <div ref={ref} style={{ height: 1 }} />
            )}
            <FileDisplay
              key={`${folder}-${file}`}
              folderName={folder}
              fileName={file}
              isSelect={isSelectionView}
              resetSelection={toggle}
            />
          </Col>
        ))}
      </Row>
      <ConfirmButton
        handleReset={handleReset}
        handleConfirmation={handleConfirmation}
        msg={isSelectionView ? "select" : "remove"}
      />
    </div>
  );
};

export default MainPhotosView;
