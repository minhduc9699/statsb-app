import React from "react";
import { useSelector } from "react-redux";
import { formatTime } from "../../utils/formatTime";
import EventCreateStepsV2 from "./EventCreateSteps-v2"

const EventCreator = () => {
  // video store
  const currentTime = useSelector((state) => state.video.currentTime);
  const isPlaying = useSelector((state) => state.video.isPlaying);
  // match store
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);


  return (
    <div className="h-full w-full flex items-center justify-center bg-white rounded shadow">
      <div className="w-full h-[100%] p-4 bg-white rounded shadow">
        {!isPlaying && (
          <>
            <div className="text-[20px] pb-[16px] text-start">
              Create Event at (
              <span className="text-sky-500">{formatTime(currentTime)}</span>)
            </div>
            <EventCreateStepsV2 />
          </>
        )}
      </div>
    </div>
  );
};

export default EventCreator;
