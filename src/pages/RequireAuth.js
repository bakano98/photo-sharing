import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthWrapper";

const RequireAuth = ({ allowedRoles }) => {
  const { user } = useAuth();

  const location = useLocation();
  return user.auth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
