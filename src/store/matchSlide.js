import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matchDataStore: null,
  matchId: null,
  homeTeam: null,
  awayTeam: null,
  matchEvents: [],
  editingEvent: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatchDataStore: (state, action) => {
      state.matchDataStore = action.payload;
    },
    setMatchTeams: (state, action) => {
      const { homeTeam, awayTeam } = action.payload;
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
    resetMatchState: (state) => {
      state.matchDataStore = null;
      state.matchId = null;
      state.homeTeam = null;
      state.awayTeam = null;
      state.matchEvents = [];
      state.editingEvent = null;
    },
  },
});

export const {
  setMatchDataStore,
  setMatchTeams,
  setMatchId,
  setGameType,
  clearMatchInfo,
  setMatchEvents,
  setEditingEvent,
  clearEditingEvent,
  resetMatchState,
} = matchSlice.actions;

export default matchSlice.reducer;
