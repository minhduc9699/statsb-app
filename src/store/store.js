import { configureStore } from "@reduxjs/toolkit";
import videoSlide from "./videoSlide";
import matchSlide from "./matchSlide";

const store = configureStore({
  reducer: {
    video: videoSlide,
    match: matchSlide,
  },
});

export default store;
