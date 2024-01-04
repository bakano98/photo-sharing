import React, { useState, useEffect } from "react";
import FileDisplay from "./FileDisplay";
import { Navigate } from "react-router-dom";
import { useSelection } from "../context/SelectionWrapper";
import ConfirmButton from "../components/ConfirmButton";
import "./PhotosView.css"; // Import the updated CSS file for styling

const SelectedPhotosView = ({ accessibleFolders, accessible, isSelect }) => {
  const { selection, resetSelection } = useSelection();
  const [toggle, setToggle] = useState(false);
  const handleConfirmation = () => {
    console.log(selection);
  };

  useEffect(() => {
    resetSelection();
  }, []);

  const handleReset = () => {
    setToggle(!toggle);
    resetSelection();
  };

  if (accessibleFolders == "") {
    return <Navigate to="/view" />;
  }

  return (
    <div className="all-photos-container">
      <div className="photos-grid">
        {accessibleFolders.map((folder) =>
          accessible[folder].map((file) => (
            <FileDisplay
              key={`${folder}-${file}`}
              folderName={folder}
              fileName={file}
              isSelect={isSelect}
              resetSelection={toggle}
            />
          ))
        )}
      </div>
      <ConfirmButton
        resetSelection={handleReset}
        handleConfirmation={handleConfirmation}
      />
    </div>
  );
};

export default SelectedPhotosView;
