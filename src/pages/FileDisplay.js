import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthWrapper";
import { useSelection } from "../context/SelectionWrapper";
import { Checkbox } from "antd";

const FileDisplay = ({ folderName, fileName, resetSelection }) => {
  const { user } = useAuth();
  const { updateSelection } = useSelection();
  const [imageURL, setImageURL] = useState("");
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (
      (!fileName.includes("JPG") && !fileName.includes("png")) ||
      fileName === undefined
    ) {
      console.log("Not an image -- skipping");
      return;
    }
    fetch(
      `http://localhost:8080/files/retrieveFile/${folderName}/${fileName}`,
      // `https://photo-sharing-vskw.onrender.com/files/retrieveFile/${folder}/${filename}`,
      {
        method: "GET",
        headers: {
          accesscode: user.code,
          email: user.email,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const imageURL = URL.createObjectURL(blob);
        setImageURL(imageURL);
      })
      .catch((error) => {
        setImageURL("");
        console.error("Error fetching image:", error);
      });
  }, []);

  useEffect(() => {
    setCheck(false);
  }, [resetSelection]);

  const isDesktop = window.innerWidth > 768; // Adjust the breakpoint as needed

  return imageURL ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #ccc",
        padding: "8px",
        margin: "8px",
      }}
      onClick={() => {
        setCheck(!check);
        updateSelection(`${folderName}/${fileName}`);
      }}
    >
      <img
        height={isDesktop ? "267" : "178"} // Adjusted height for non-desktop
        width={isDesktop ? "400" : "267"} // Adjusted width for non-desktop
        src={imageURL}
        loading="lazy"
        alt=""
        style={{ cursor: "pointer" }}
      />
      <Checkbox checked={check} style={{ marginTop: "8px" }}></Checkbox>
    </div>
  ) : (
    <></>
  );
};

export default FileDisplay;
