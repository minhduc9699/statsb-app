import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchId: null,
  gameType: "5v5",
  homeTeam: null,
  awayTeam: null,
  matchEvents: [],
  editingEvent: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatchInfo: (state, action) => {
      const { gameType, homeTeam, awayTeam } = action.payload;
      state.gameType = gameType;
      state.homeTeam = homeTeam;
      state.awayTeam = awayTeam;
    },
    setGameType: (state, action) => {
      state.gameType = action.payload;
    },
    setMatchId: (state, action) => {
      state.matchId = action.payload;
    },
    setMatchEvents: (state, action) => {
      state.matchEvents = [...state.matchEvents, action.payload];
    },
    setEditingEvent: (state, action) => {
      console.log(action.payload);
      state.editingEvent = action.payload;
    },
    clearEditingEvent: (state) => {
      state.editingEvent = null;
    },
  },
});

export const {
  setMatchInfo,
  setMatchId,
  setGameType,
  clearMatchInfo,
  setMatchEvents,
  setEditingEvent,
  clearEditingEvent,
} = matchSlice.actions;

export default matchSlice.reducer;
