import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const matchAPI = {
  createMatch: async (matchData) => {
    try {
      const response = await axios.post(`${BASE_URL}/matches`, matchData);
      return response.data;
    } catch (error) {
      console.error("Error creating match:", error);
      throw error;
    }
  },

  updateMatch: async (id, matchData) => {
    try {
      const response = await axios.put(`${BASE_URL}/matches/${id}`, matchData);
      return response.data;
    } catch (error) {
      console.error("Error updating match:", error);
      throw error;
    }
  },

  deleteMatch: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/matches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting match with ID ${id}:`, error);
      throw error;
    }
  },

  getMatchById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/matches/${id}/getMatch`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match with ID ${id}:`, error);
      throw error;
    }
  },

  getAllMatches: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/matches`);
      return response.data;
    } catch (error) {
      console.error("Error fetching matches:", error);
      throw error;
    }
  },

  reCaculateMatches: async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/matches/stats/batchCalculate`
      );
      return response.data;
    } catch (error) {
      console.error("Error reCaculateMatches:", error);
      throw error;
    }
  },
};

export default matchAPI;
