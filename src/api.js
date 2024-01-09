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
      const response = await api.post("/apis/getUser", data);
      return response.data;
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
};

export default API;
