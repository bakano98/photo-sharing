// api.js

import axios from "axios";

// const baseURL = "http://localhost:8080"; // Adjust the base URL according to your API server
const baseURL = "https://photo-sharing-vskw.onrender.com/";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const API = {
  getAccessibleFolders: async (headers) => {
    // Returns Object with { Folder : ["photos"] } mapping.
    try {
      const response = await api.get("/files/accessible", { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getSelected: async (headers) => {
    try {
      // Passed data must contain the folders that they can access.
      // Then, we return
      const response = await api.get("/files/get-selected", { headers });
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
      if (!dat.success) {
        return dat;
      }

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
  getDirectories: async (headers) => {
    try {
      const response = await api.get("/files/getDirectories", { headers });
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
  addSelectedPhotos: async (data, headers) => {
    try {
      const response = await api.post("/files/add-selection", data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  removeSelectedPhotos: async (data, headers) => {
    try {
      const response = await api.post("/files/remove-selection", data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  resetSelectedPhotos: async (headers) => {
    try {
      const response = await api.post("/files/reset-selections", null, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  mailUserCode: async (headers) => {
    try {
      const response = await api.post("/apis/send-emails", null, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  mailSingleUsercode: async (data, headers) => {
    try {
      const response = await api.post("/apis/send-single-email", data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default API;
