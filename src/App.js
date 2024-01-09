import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import RequireAuth from "./pages/RequireAuth";
import Missing from "./pages/Missing";
import { Login } from "./pages/Login";
import { Viewing } from "./pages/Viewing";
import AdminDashboard from "./pages/AdminDashboard";
import UserPermissions from "./pages/UserPermissions";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* we want to protect these routes */}
        <Route element={<RequireAuth />}>
          <Route path="/view/*" element={<Viewing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/user-perms" element={<UserPermissions />} />
          {/* All other files should be accessed from /view */}
        </Route>

        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;
