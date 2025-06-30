import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSeekingTime } from "../../store/videoSlide";
import { formatTime } from "../../utils/formatTime";

// Icon cho từng event (có thể custom thêm)
const eventTypeMeta = {
  "2-Point Score": { label: "2PT", color: "bg-yellow-400", icon: "🏀" },
  "3-Point Score": { label: "3PT", color: "bg-blue-400", icon: "🎯" },
  "Free Throw":    { label: "FT",  color: "bg-indigo-400", icon: "🎯" },
  "Rebound":       { label: "REB", color: "bg-green-400", icon: "🔁" },
  "Turnover":      { label: "TO",  color: "bg-red-400", icon: "💥" },
  "Steal":         { label: "STL", color: "bg-pink-400", icon: "🕵️" },
  "Block":         { label: "BLK", color: "bg-cyan-400", icon: "🧱" },
  "Foul":          { label: "FOUL",color: "bg-orange-400", icon: "🚫" },
};

const EventLog = () => {
  const dispatch = useDispatch();
  const matchEvents = useSelector((state) => state.match.matchEvents);

  return (
    <div className="w-full h-full bg-white rounded p-3 overflow-y-auto shadow-lg text-xs">
      <div className="font-bold text-center mb-2 tracking-wider text-gray-700 text-sm">
        Event Log
      </div>
      {(!matchEvents || matchEvents.length === 0) && (
        <div className="text-gray-400 text-center mt-7">No event yet.</div>
      )}
      <ul className="flex flex-col gap-1">
        {matchEvents &&
          matchEvents
            .slice()
            .reverse()
            .map((event, idx) => {
              const meta = eventTypeMeta[event.type] || {
                label: event.type,
                color: "bg-gray-400",
                icon: "❓",
              };
              return (
                <li
                  key={event.id || event._id || idx}
                  onClick={() => dispatch(setSeekingTime(event.timestamps.start))}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 bg-gradient-to-br from-white to-slate-100 hover:bg-sky-50 shadow-sm border border-slate-100 transition cursor-pointer"
                >
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full ${meta.color} text-white font-bold shadow`}
                    title={event.type}
                  >
                    {meta.icon}
                  </span>
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-700 text-[13px]">
                      {event.player.name}{" "}
                      <span className="text-gray-400 font-normal ml-1">
                        {event.details?.shotType && `(${event.details.shotType})`}
                      </span>
                    </span>
                    <span className="text-[12px] text-gray-500">
                      {meta.label}{" "}
                      {event.details?.outcome && (
                        <span className="ml-1">
                          {event.details.outcome === "Made" ? (
                            <span className="text-green-600 font-semibold">✔️</span>
                          ) : (
                            <span className="text-red-600 font-semibold">❌</span>
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded bg-sky-100 font-bold text-sky-600 text-xs shadow-sm">
                    {formatTime(event.timestamps?.start)}
                  </span>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default EventLog;
