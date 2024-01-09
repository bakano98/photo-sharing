import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AuthContext = createContext();

const def = { code: "", email: "", auth: false };

export const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(def);
  const navigate = useNavigate();

  const autoLogin = async () => {
    if (user.auth) {
      return;
    }

    const code = localStorage.getItem("accessCode");
    const email = localStorage.getItem("email");

    // Then we can just do the login routine
    if (code && email) {
      console.log("Attempting to automatically login...");
      const success = await login(code, email);
      if (success) {
        navigate("/view");
      } else {
        console.log("Received invalid credentials!");
        localStorage.removeItem("accessCode");
        localStorage.removeItem("email");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    autoLogin();
  }, [user]);

  const login = async (accessCode, email) => {
    // View permissions are based solely on their email. The accessCode will only allow them to login.
    const data = { code: accessCode, email: email };

    // Make API call
    const response = await API.authUser(data);
    if (response.success) {
      console.log("Setting localStorage");
      localStorage.setItem("accessCode", accessCode);
      localStorage.setItem("email", email);
      setUser({ code: accessCode, email: email, auth: true });
    }

    return response;
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
