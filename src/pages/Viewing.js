import React, { useState, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import MainPhotosView from "./MainPhotosView";
import FolderView from "./FolderView";
import { Typography } from "antd";
import { useAuth } from "../context/AuthWrapper";
import API from "../api";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import ClickOutside from "../components/ClickOutside";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "../App.css";

const { Title } = Typography;

// Function to filter items from obj1 based on obj2
const filterObj1 = (obj1, obj2) => {
  const result = {};

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      // Check if obj2 has the same key, otherwise, set an empty array
      const obj2Array = obj2[key] || [];

      // Filter items from obj1[key] based on obj2Array
      result[key] = obj1[key].filter((item) => !obj2Array.includes(item));
    }
  }

  return result;
};

export const Viewing = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(false);
  const [unselected, setUnselected] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedLen, setSelectedLen] = useState(0);
  const [accessible, setAccessible] = useState("");
  const [accessibleFolders, setAccessibleFolders] = useState("");
  const [expanded, setExpanded] = useState(false);

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
    const folders = Object.keys(res);
    setAccessibleFolders(folders);
    setAccessible(res);
    // Make API call to MongoDB backend to get the selected photos
    // Make API calls to only the accessible folders
    const resp = await API.getSelected(headers);

    if (!resp.success) {
      console.log("Something went wrong");
      return;
    }
    const selected = resp.data;
    delete selected._id;
    const unselected = filterObj1(res, selected);
    setUnselected(unselected);
    setSelected(selected);
    var len = 0;
    for (const k in selected) {
      if (selected.hasOwnProperty(k)) {
        len += selected[k].length;
      }
    }

    setSelectedLen(len);
  };

  useEffect(() => {
    if (!details) {
      getInfo();
    }

    getAccessibleFolders();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
        <ClickOutside onClickOutside={() => setExpanded(false)}>
          <SideNav
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
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
                    <NavItem
                      key={folderName}
                      eventKey={`folders/${folderName}`}
                    >
                      <NavText>{`${folderName} (${accessible[folderName].length})`}</NavText>
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
                <NavText>My Selected Photos ({selectedLen})</NavText>
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
        </ClickOutside>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          marginLeft: "240px", // Adjusted margin to account for the sidebar width
          display: "flex",
          flexDirection: "column",
          flex: 1,
          "@media (maxWidth: 768px)": {
            marginLeft: 0,
          },
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
                unselected={unselected}
                selected={selected}
                setRenderCallback={setRenderCallback}
              />
            }
          />
          <Route
            path="rem-photos"
            element={
              <MainPhotosView
                key="rem-photos"
                photos={unselected}
                accessibleFolders={accessibleFolders}
                isSelectionView={true}
                setRenderCallback={setRenderCallback}
              />
            }
          />
          <Route
            path="selected-photos"
            element={
              <MainPhotosView
                key="selected-photos"
                photos={selected}
                accessibleFolders={accessibleFolders}
                isSelectionView={false}
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
  width: "240px",
  height: "100%",
  position: "fixed",
  top: 0,
  left: 0,
  color: "#fff",
  transition: "width 0.3s",

  "@media (maxWidth: 768px)": {
    width: "60px",
  },
};
