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
    <div className="flex items-start justify-center bg-white rounded shadow h-full">
      <div className="w-full p-4 h-full">
        {!isPlaying && (
          <>
            <div className="text-[20px] text-start">
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
