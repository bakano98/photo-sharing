import React from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthWrapper";
import { Button, Typography } from "antd";

const { Title } = Typography;

const getJson = async (headers) => {
  try {
    const res = await API.getSelectedPhotos(headers);

    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(res)], { type: "application/json" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    downloadLink.download = "selectedPhotos.json";

    // Append the link to the document
    document.body.appendChild(downloadLink);

    // Trigger a click on the link to initiate the download
    downloadLink.click();

    // Remove the link from the document
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Error downloading JSON:", error);
  }
};

const generateCode = async (headers) => {
  try {
    const res = await API.generateAccessCode(headers);
    //console.log(res);
    if (res.success) {
      alert("Successfully generated new access codes for all users.");
    } else {
      alert("Failed to generate new access code");
    }
  } catch (error) {
    console.error(error);
  }
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const headers = { accesscode: user.code, email: user.email };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Title level={1} style={{ marginBottom: "20px" }}>
        Admin Dashboard
      </Title>
      <div style={{ marginBottom: "10px" }}>
        <Button type="primary" onClick={() => getJson(headers)}>
          Download JSON
        </Button>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <Button type="primary" onClick={() => generateCode(headers)}>
          Generate new access code
        </Button>
      </div>
      <div>
        <Button
          type="primary"
          style={{ marginBottom: "10px" }}
          onClick={() => navigate("user-perms")}
        >
          Update user permissions
        </Button>
      </div>
      <div>
        <Button
          style={{
            background: "#1890ff",
            color: "#fff",
            borderColor: "#1890ff",
          }}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
