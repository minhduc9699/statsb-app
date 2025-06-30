import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const playerAPI = {
  getAllPlayers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/players`);
      return response.data;
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  },

  getPlayerById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/players/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching player with ID ${id}:`, error);
      throw error;
    }
  },

  createPlayer: async (playerData) => {
    try {
      const response = await axios.post(`${BASE_URL}/players`, playerData);
      return response.data;
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  },

  updatePlayer: async (id, playerData) => {
    try {
      const response = await axios.put(`${BASE_URL}/players/${id}`, playerData);
      return response.data;
    } catch (error) {
      console.error("Error updating player:", error);
      throw error;
    }
  },

  deletePlayer: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/players/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting player with ID ${id}:`, error);
      throw error;
    }
  },
};

export default playerAPI;
