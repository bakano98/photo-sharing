// api.js

import axios from "axios";

const baseURL = "http://localhost:8080"; // Adjust the base URL according to your API server

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const API = {
  getAccessibleFolders: async (headers) => {
    console.log("a");
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
  moveFiles: async (data) => {
    try {
      const response = await api.post("/files/move-files", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Add more API calls as needed
  authAccessCode: async (data) => {
    try {
      const response = await api.post("/auth", data);
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getUser: async (data) => {
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
