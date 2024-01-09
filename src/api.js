// api.js

import axios from "axios";

const baseURL = "http://localhost:8080"; // Adjust the base URL according to your API server
// const baseURL = "https://photo-sharing-vskw.onrender.com/";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const API = {
  getAccessibleFolders: async (headers) => {
    try {
      const response = await api.get("/files/accessible", { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAccessibleAndSelectedPhotos: async (headers) => {
    try {
      const response = await api.get("/files/accessibleSelectedPhotos", {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  moveFiles: async (data, headers) => {
    try {
      const response = await api.post("/files/move-files", data, { headers });
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Add more API calls as needed
  authUser: async (data) => {
    try {
      const response = await api.post("/apis/authUser", data);
      const dat = response.data;
      if (dat.data["role"] === "admin") {
        dat["redirect"] = "/admin";
      } else {
        dat["redirect"] = "/view";
      }

      return dat;
    } catch (error) {
      throw error;
    }
  },
  addUser: async (data) => {
    try {
      const response = await api.post("/apis/addUser", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Admin APIs
  getUsers: async (headers) => {
    try {
      const response = await api.get("/apis/getUsers", { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Updating user permissions -- which folders they can access
  updateUserPermissions: async (data, headers) => {
    try {
      const response = await api.post("/apis/updatePermissions", data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate new access code
  generateAccessCode: async (headers) => {
    try {
      const response = await api.post("/apis/generateCode", null, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Exporting photos (file names in JSON) to be edited.
  // We will process this in Python/Powershell and then use it to move from SD card to our local environment :)
  getSelectedPhotos: async (headers) => {
    try {
      const response = await api.get("/files/selected-photos", { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default API;
