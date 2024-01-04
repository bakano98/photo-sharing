import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import MainPhotosView from "./MainPhotosView";
import FolderView from "./FolderView";
import { Typography } from "antd";
import { useAuth } from "../context/AuthWrapper";
import { useSelection } from "../context/SelectionWrapper";
import API from "../api";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "../App.css";

const { Title } = Typography;

export const Viewing = () => {
  const navigate = useNavigate();
  const { selection, resetSelection } = useSelection();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState("");
  const [accessible, setAccessible] = useState("");
  const [accessibleFolders, setAccessibleFolders] = useState("");
  const accessCode = user.code;
  const email = user.email;
  // make API call
  const getInfo = async () => {
    const res = await API.getUser({ code: accessCode, email: email });
    setDetails(res.data);
  };

  const handleSubmit = () => {
    console.log(selection);
  };

  const getAccessibleFolders = async () => {
    // change to use email next time
    const headers = { accesscode: user.code, email: user.email };
    const res = await API.getAccessibleFolders(headers);
    setAccessible(res);
    setAccessibleFolders(Object.keys(res));
  };

  useEffect(() => {
    if (!details) {
      getInfo();
    }

    if (!accessibleFolders) {
      getAccessibleFolders();
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

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
      <div style={{ width: "250px" }}>
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
              {accessibleFolders == "" ? (
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
          </SideNav.Nav>
        </SideNav>
      </div>

      {/* Main Content Container */}
      <div
        style={{ marginLeft: "30px", display: "flex", flexDirection: "column" }}
      >
        {/* Title */}
        <Title style={{ textAlign: "center" }}>Hello, {details.perfName}</Title>

        {/* View Content */}
        <Routes>
          <Route
            path="folders/:folderName/*"
            element={<FolderView accessible={accessible} />}
          />
          <Route
            path="rem-photos"
            element={
              <MainPhotosView
                key="rem-photos"
                accessible={accessible}
                accessibleFolders={accessibleFolders}
                isSelect={false}
              />
            }
          />
          <Route
            path="selected-photos"
            element={
              <MainPhotosView
                key="selected-photos"
                accessible={accessible}
                accessibleFolders={accessibleFolders}
                isSelect={true}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};
