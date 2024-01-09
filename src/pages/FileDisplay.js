import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthWrapper";
import { useSelection } from "../context/SelectionWrapper";
import { Checkbox } from "antd";

const FileDisplay = ({ folderName, fileName, isSelect, resetSelection }) => {
  const { user } = useAuth();
  const { updateSelection } = useSelection();
  const [imageURL, setImageURL] = useState("");
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const folder = folderName;
    const filename = isSelect ? fileName.split("/")[1] : fileName;
    if (
      (!fileName.includes("JPG") && !fileName.includes("png")) ||
      filename === undefined
    ) {
      console.log("Not an image -- skipping");
      return;
    }
    fetch(
      `http://localhost:8080/files/retrieveFile/${folder}/${isSelect}/${filename}`,
      // `https://photo-sharing-vskw.onrender.com/files/retrieveFile/${folder}/${isSelect}/${filename}`,
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
  }, [isSelect]);

  useEffect(() => {
    setCheck(false);
  }, [resetSelection]);

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
        height="267"
        width="400"
        src={imageURL}
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
