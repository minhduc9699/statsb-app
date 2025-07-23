// TimelineTracker.js
import React, { useState, useRef, useEffect } from "react";
import { formatTime } from "@/utils/formatTime";
import { useSelector, useDispatch } from "react-redux";
import { setSeekingTime } from "@/store/videoSlide";
import { setLastEventCreatedAt, setEditingEvent } from "@/store/matchSlide";
import eventAPI from "@/api/eventAPI";
import EventToastNoti from "@/components/matchStudio/EventToastNoti";

const eventTypes = [
  { type: "2-Point Score", color: "bg-yellow-400", icon: "🏀" },
  { type: "3-Point Score", color: "bg-yellow-400", icon: "🏀" },
  { type: "Free Throw", color: "bg-indigo-400", icon: "🎯" },
  { type: "Turnover", color: "bg-red-400", icon: "💥" },
  { type: "Steal", color: "bg-pink-400", icon: "🕵️" },
  { type: "Block", color: "bg-cyan-400", icon: "🧱" },
  { type: "Rebound", color: "bg-green-400", icon: "🔁" },
  { type: "Foul", color: "bg-orange-400", icon: "🚫" },
];

const TimelineTracker = ({ matchId }) => {
  const dispatch = useDispatch();
  const leaveTimeout = useRef();
  const tooltipRef = useRef(null);
  const eventRef = useRef(null);

  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);
  const matchEvents = useSelector((state) => state.match.matchEvents);

  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [toast, setToast] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState("all");
  const [tooltipPos, setTooltipPos] = useState({ x: "center", y: "bottom" });

  useEffect(() => {
    if (!matchEvents) return;
    setEvents(matchEvents);
  }, [matchEvents]);

  const handleMouseEnter = (id) => {
    clearTimeout(leaveTimeout.current);
    setHoveredEventId(id);
  };

  const handleMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => setHoveredEventId(null), 200);
  };

  useEffect(() => {
    if (!hoveredEventId || !tooltipRef.current || !eventRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const eventRect = eventRef.current.getBoundingClientRect();
    const padding = 8;

    let x = "center";
    if (tooltipRect.left < padding) x = "left";
    else if (tooltipRect.right > window.innerWidth - padding) x = "right";

    let y = "bottom";
    if (tooltipRect.bottom > window.innerHeight - padding) y = "top";

    setTooltipPos({ x, y });
  }, [hoveredEventId]);

  const getRowIndex = (eventType) => {
    return eventTypes.findIndex((et) =>
      et.subTypes ? et.subTypes.includes(eventType) : et.type === eventType
    );
  };

  const handleEditEvent = (event) => {
    dispatch(setEditingEvent(event));
  };

  const handleConfirmDelete = async (event) => {
    try {
      await eventAPI.deleteEvent(matchId, event.id);
      dispatch(setLastEventCreatedAt(new Date().toISOString()));
      setToast("✔️ Event deleted successfully!");
    } catch (err) {
      console.log(err);
      setToast("❌ Failed to delete event.");
    }
  };

  const filteredEvents =
    selectedTeamId === "all"
      ? events
      : events.filter((e) => e.team?.id === selectedTeamId);

  const teams = Array.from(new Set(events.map((e) => e.team?.id))).map((id) => {
    const team = events.find((e) => e.team?.id === id)?.team;
    return { id: team?.id, name: team?.name, avatar: team?.avatar };
  });

  return (
    <div className="w-full h-full flex flex-col relative">
      {toast && (
        <EventToastNoti message={toast} onClose={() => setToast(null)} />
      )}

      <div className="flex gap-2 mb-3 items-center">
        <button
          className={`px-3 py-1 rounded ${
            selectedTeamId === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setSelectedTeamId("all")}
        >
          All Teams
        </button>
        {teams.map((team,index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded flex items-center gap-2 ${
              selectedTeamId === team.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedTeamId(team.id)}
          >
            {team.avatar && (
              <img
                src={team.avatar}
                className="w-5 h-5 rounded-full"
                alt="team"
              />
            )}
            {team.name}
          </button>
        ))}
      </div>

      <div className="relative bg-gray-200 flex-1 rounded overflow-visible">
        {[...Array(eventTypes.length - 1)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 w-full border-t border-gray-300"
            style={{ top: `${((i + 1) / eventTypes.length) * 100}%` }}
          />
        ))}

        <div
          className="absolute top-0 bottom-0 w-[2px] bg-sky-500 z-10"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />

        {filteredEvents.map((event) => {
          if (!event.timestamps) return null;
          const rowIndex = getRowIndex(event.type);
          const typeObj = eventTypes[rowIndex];
          const startPercent = (event.timestamps.start / duration) * 100;
          const endPercent = (event.timestamps.end / duration) * 100;
          const widthPercent = Math.max(endPercent - startPercent, 0.5);
          const topPercent = (rowIndex / eventTypes.length) * 100;
          const isHovered = hoveredEventId === event.id;

          return (
            <div
              key={event.id}
              ref={isHovered ? eventRef : null}
              className={`absolute h-[14.285%] ${
                typeObj?.color || "bg-gray-400"
              } rounded-md cursor-pointer group flex items-center justify-center px-1 text-white text-xs`}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                top: `${topPercent}%`,
              }}
              onClick={() => dispatch(setSeekingTime(event.timestamps.start))}
              onMouseEnter={() => handleMouseEnter(event.id)}
              onMouseLeave={handleMouseLeave}
            >
              <span>{typeObj?.icon}</span>

              {isHovered && (
                <div
                  ref={tooltipRef}
                  className={`absolute z-50 font-bold text-gray-700 min-w-[190px] bg-white rounded shadow-xl border p-3 text-sm animate-fade-in
                    ${
                      tooltipPos.x === "center"
                        ? "left-1/2 -translate-x-1/2"
                        : ""
                    }
                    ${tooltipPos.x === "left" ? "left-0" : ""}
                    ${tooltipPos.x === "right" ? "right-0" : ""}
                    ${
                      tooltipPos.y === "top"
                        ? "bottom-full mb-2"
                        : "top-full mt-2"
                    }`}
                >
                  <div className="mb-1">{event.type}</div>
                  <div>
                    <span className="font-semibold">Time: </span>
                    {event.timestamps?.start && event.timestamps?.end
                      ? `${Number(event.timestamps.start).toFixed(
                          1
                        )}s - ${Number(event.timestamps.end).toFixed(1)}s`
                      : "?"}
                  </div>
                  {event.details?.shotType && (
                    <div>
                      <span className="font-semibold">Shot type: </span>
                      {event.details.shotType}
                    </div>
                  )}
                  {event.details?.outcome && (
                    <div>
                      <span className="font-semibold">Outcome: </span>
                      <span
                        className={
                          event.details.outcome === "Made"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {event.details.outcome}
                      </span>
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingEvent({
                          id: event.id,
                          type: event.type,
                          player: event.player,
                        });
                      }}
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[#ADB5BD] text-xs mt-1">
        <span>0:00</span>
        <span>{formatTime(duration / 4)}</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime((duration * 3) / 4)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {deletingEvent && (
        <div className="fixed inset-0 z-[999] bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 text-center max-w-[90vw]">
            <div className="mb-4 font-bold text-lg text-red-600">
              Xác nhận xóa Event?
            </div>
            <div className="mb-3 text-gray-700">
              {deletingEvent.type} • {deletingEvent.player.name}
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setDeletingEvent(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  await handleConfirmDelete(deletingEvent);
                  setDeletingEvent(null);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineTracker;
