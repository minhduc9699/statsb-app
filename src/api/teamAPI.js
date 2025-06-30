import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const teamAPI = {
  createTeam: async (teamData) => {
    try {
      const response = await axios.post(`${BASE_URL}/teams`, teamData);
      return response.data;
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  },

  updateTeam: async (id, teamData) => {
    try {
      const response = await axios.put(`${BASE_URL}/teams/${id}`, teamData);
      return response.data;
    } catch (error) {
      console.error("Error updating team:", error);
      throw error;
    }
  },

  deleteTeam: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting team with ID ${id}:`, error);
      throw error;
    }
  },

  getTeamById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/teams/${id}/getTeam`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team with ID ${id}:`, error);
      throw error;
    }
  },

  getAllTeams: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/teams`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }
  },
};

export default teamAPI;
