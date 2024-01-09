import React, { useState, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import MainPhotosView from "./MainPhotosView";
import FolderView from "./FolderView";
import { Typography } from "antd";
import { useAuth } from "../context/AuthWrapper";
import API from "../api";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "../App.css";

const { Title } = Typography;

export const Viewing = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(false);
  const [accessible, setAccessible] = useState("");
  const [selectedAccessible, setSelectedAccessible] = useState("");
  const [accessibleFolders, setAccessibleFolders] = useState("");

  // This is used to force a re-render after moving files. Probably not the best way to do it buuuuut
  const [renderCallback, setRenderCallback] = useState("");
  const accessCode = user.code;
  const email = user.email;
  // make API call
  const getInfo = async () => {
    const res = await API.authUser({ code: accessCode, email: email });
    setDetails(res.data);
  };

  const getAccessibleFolders = async () => {
    const headers = { accesscode: user.code, email: user.email };
    const res = await API.getAccessibleFolders(headers);
    setAccessible(res);
    const selected = Object.fromEntries(
      Object.entries(res).map(([key, value]) => [
        key,
        value.filter((item) => item.includes("selected/")),
      ])
    );
    const unselected = Object.fromEntries(
      Object.entries(res).map(([key, value]) => [
        key,
        value.filter((item) => !item.includes("selected/")),
      ])
    );

    setAccessible(unselected);
    setSelectedAccessible(selected);
    setAccessibleFolders(Object.keys(res));
  };

  useEffect(() => {
    if (!details) {
      getInfo();
    }

    getAccessibleFolders();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
    //console.log("Refreshing!");
  }, [renderCallback]);

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      {/* SideNav Container */}
      <div style={sidebarStyles}>
        <SideNav
          onSelect={(selected) => {
            navigate(selected);
          }}
        >
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected="folders">
            <NavItem eventKey="folders">
              <NavIcon>
                <i
                  className="fa fa-fw fa-home"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>Folders</NavText>
              {accessibleFolders === "" ? (
                <></>
              ) : (
                accessibleFolders.map((folderName) => (
                  <NavItem key={folderName} eventKey={`folders/${folderName}`}>
                    <NavText>{folderName}</NavText>
                  </NavItem>
                ))
              )}
            </NavItem>
            <NavItem eventKey="rem-photos">
              <NavIcon>
                <i
                  className="fa fa-fw fa-home"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>My Remaining Photos</NavText>
            </NavItem>
            <NavItem eventKey="selected-photos">
              <NavIcon>
                <i
                  className="fa fa-fw fa-home"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>My Selected Photos</NavText>
            </NavItem>
            <NavItem eventKey="logout" onClick={() => logout()}>
              <NavIcon>
                <i
                  className="fa fa-fw fa-home"
                  style={{ fontSize: "1.75em" }}
                />
              </NavIcon>
              <NavText>Logout</NavText>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          marginLeft: "240px", // Adjusted margin to account for the sidebar width
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Title */}
        <Title style={{ textAlign: "center" }}>
          Hello, {details ? details.perfName : ""}
        </Title>

        {/* View Content */}
        <Routes>
          <Route
            path="folders/:folderName/*"
            element={
              <FolderView
                accessible={accessible}
                selectedAccessible={selectedAccessible}
                setRenderCallback={setRenderCallback}
              />
            }
          />
          <Route
            path="rem-photos"
            element={
              <MainPhotosView
                key="rem-photos"
                accessible={accessible}
                accessibleFolders={accessibleFolders}
                isSelect={false}
                setRenderCallback={setRenderCallback}
              />
            }
          />
          <Route
            path="selected-photos"
            element={
              <MainPhotosView
                key="selected-photos"
                accessible={selectedAccessible}
                accessibleFolders={accessibleFolders}
                isSelect={true}
                setRenderCallback={setRenderCallback}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

// Add a new CSS class for the sidebar container
const sidebarStyles = {
  width: "240px", // Set a fixed or flexible width for the sidebar
  height: "100%", // Make the sidebar fill the full height of the body
  position: "fixed", // Fixed position to stay in place while scrolling
  top: 0, // Align the top of the sidebar with the top of the viewport
  left: 0, // Align the left of the sidebar with the left of the viewport
  color: "#fff", // Set text color as needed
};
