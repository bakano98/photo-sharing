import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

const def = { code: "admin", email: "98lawweijie@gmail.com", auth: true };

export const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(def);

  const login = async (accessCode, email) => {
    //TODO: Ensure that accessCode and email are being used for validation.
    // View permissions are based solely on their email. The accessCode will only allow them to login.
    const data = { accessCode: accessCode, email: email };
    // Make API call
    const response = await API.authAccessCode(data);
    if (response.success) {
      setUser({ code: accessCode, auth: true });
    }

    return response.success;
  };

  const logout = () => {
    setUser(def);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
