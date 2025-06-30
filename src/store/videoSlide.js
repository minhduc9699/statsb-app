import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [], // { id, file, name, duration }
  currentVideoIndex: 0,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  seekingTime: 0,
};

const videoSlide = createSlice({
  name: "video",
  initialState,
  reducers: {
    addVideo: (state, action) => {
      state.videos.push(action.payload);
    },
    setCurrentVideoIndex: (state, action) => {
      state.currentVideoIndex = action.payload;
    },
    moveVideo: (state, action) => {
      const { fromIdx, toIdx } = action.payload;
      if (
        fromIdx < 0 ||
        fromIdx >= state.videos.length ||
        toIdx < 0 ||
        toIdx >= state.videos.length ||
        fromIdx === toIdx
      ) {
        return;
      }

      const updated = [...state.videos];
      const [movedVideo] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, movedVideo);
      state.videos = updated;
    },
    renameVideo: (state, action) => {
      const { id, name } = action.payload;
      state.videos[id].name = name;
    },
    deleteVideo: (state, action) => {
      const { id } = action.payload;
      state.videos.splice(id, 1);
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setSeekingTime: (state, action) => {
      state.seekingTime = action.payload;
    },
  },
});

export const {
  addVideo,
  setCurrentVideoIndex,
  moveVideo,
  renameVideo,
  deleteVideo,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  setSeekingTime
} = videoSlide.actions;
export default videoSlide.reducer;
