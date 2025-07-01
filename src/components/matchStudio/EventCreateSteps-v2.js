import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMatchEvents, clearEditingEvent } from "../../store/matchSlide";
import { eventStepConfigv2 } from "../../config/eventStepConfigv2";
import EventAPI from "../../api/eventAPI";
import EventToastNoti from "./EventToastNoti";
import basketballFullCourt from "../../assets/court/Basketball_court_fiba.svg";

const eventTypes = Object.keys(eventStepConfigv2);

const EventCreateStepsV2 = () => {
  const dispatch = useDispatch();
  const gameType = useSelector((state) => state.match.gameType);
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);
  const matchId = useSelector((state) => state.match.matchId);
  const currentTime = useSelector((state) => state.video.currentTime);
  const editingEvent = useSelector((state) => state.match.editingEvent);

  // State
  const [stepIndex, setStepIndex] = useState(0);
  const [eventType, setEventType] = useState(
    editingEvent ? editingEvent.type : null
  );
  const [formData, setFormData] = useState({});
  const [courtPosition, setCourtPosition] = useState(null);
  const [onSubmit, setOnSubmit] = useState(false);
  const [toast, setToast] = useState(null);
  const steps = eventType ? eventStepConfigv2[eventType]?.steps || [] : [];

  // Pre-fill state khi sửa
  useEffect(() => {
    if (editingEvent) {
      setEventType(editingEvent.type);
      setFormData({
        ...editingEvent.details,
        team: editingEvent.team,
        player: editingEvent.player,
        location: editingEvent.details?.location,
      });
      setCourtPosition(editingEvent.details?.location || null);
      setStepIndex(0);
    }
  }, [editingEvent]);

  // Reset khi chọn lại event type lúc tạo mới
  useEffect(() => {
    console.log(eventType, editingEvent);
    if (!editingEvent) {
      setFormData({});
      setCourtPosition(null);
      setStepIndex(0);
    }
  }, [eventType, editingEvent]);

  const handleNext = (value) => {
    const key = steps[stepIndex]?.key;
    if (!key) return;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setOnSubmit(true);
    }
  };

  const handleSubmit = async () => {
    let data = {
      match: matchId,
      team: formData.team,
      player: formData.player,
      type: eventType,
      timestamps: {
        start: editingEvent ? editingEvent.timestamps?.start : currentTime,
        end: editingEvent ? editingEvent.timestamps?.end : currentTime + 0.1,
      },
      details: { ...formData },
    };

    try {
      let res;
      if (editingEvent) {
        res = await EventAPI.editEvent(matchId, editingEvent._id, data);
        dispatch(setMatchEvents(res));
        dispatch(clearEditingEvent());
        setToast("✔️ Event updated successfully!");
      } else {
        res = await EventAPI.createEvent(matchId, data);
        dispatch(setMatchEvents(res));
        setToast("✔️ Event created successfully!");
      }
      resetAll();
    } catch (err) {
      setToast("❌ Failed to save event.");
      console.error(err);
    }
  };

  const resetAll = () => {
    setEventType(null);
    setStepIndex(0);
    setFormData({});
    setOnSubmit(false);
    setCourtPosition(null);
    dispatch(clearEditingEvent());
  };

  function isValidCourt(x, y) {
    return x >= 0.05 && x <= 0.95 && y >= 0.05 && y <= 0.95;
  }
  function isValidShot(eventType, x, y) {
    if (!isValidCourt(x, y)) return false;
    const hoopLeftX = 0.08,
      hoopRightX = 0.92,
      hoopY = 0.5,
      r = 0.35;
    const dLeft = Math.sqrt((x - hoopLeftX) ** 2 + (y - hoopY) ** 2);
    const dRight = Math.sqrt((x - hoopRightX) ** 2 + (y - hoopY) ** 2);
    if (eventType === "2-Point Score") return dLeft < r || dRight < r;
    if (eventType === "3-Point Score") return dLeft >= r && dRight >= r;
    return true;
  }
  function handleClickPosition(e) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (!isValidShot(eventType, x, y)) return;
    setCourtPosition({ x, y });
    handleNext({ x, y });
  }

  const renderStep = () => {
    const step = steps[stepIndex];
    if (!step) return null;

    switch (step.type) {
      case "selectTeam":
        return (
          <div className="flex gap-4 mt-3 mb-6 w-full justify-center">
            <button
              onClick={() => handleNext(homeTeam._id)}
              className={`bg-tgray text-white px-5 py-2 rounded-lg shadow hover:bg-studiobg transition-all ${
                formData.team === homeTeam._id ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <img
                src={homeTeam.avatar}
                alt=""
                className="w-8 h-8 rounded-full mx-auto mb-1"
              />
              {homeTeam.name}
            </button>
            <button
              onClick={() => handleNext(awayTeam._id)}
              className={`bg-tgray text-white px-5 py-2 rounded-lg shadow hover:bg-studiobg transition-all ${
                formData.team === awayTeam._id ? "ring-2 ring-green-400" : ""
              }`}
            >
              <img
                src={awayTeam.avatar}
                alt=""
                className="w-8 h-8 rounded-full mx-auto mb-1"
              />
              {awayTeam.name}
            </button>
          </div>
        );
      case "selectPlayer":
        const selectedTeam =
          formData.team === homeTeam._id ? homeTeam : awayTeam;
        const players = selectedTeam?.roster || [];
        return (
          <div className="grid grid-cols-2 gap-3">
            {players.map((player) => (
              <button
                key={player.player._id}
                onClick={() => handleNext(player.player._id)}
                className={`bg-gray-100 px-3 py-2 rounded-lg hover:bg-sky-100 border shadow text-gray-800 text-sm ${
                  formData.player === player.player._id
                    ? "ring-2 ring-sky-400"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={player.player.avatar || "/avatar-default.png"}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{player.player.name}</span>
                </div>
              </button>
            ))}
          </div>
        );
      case "selectType":
        return (
          <div className="flex flex-wrap gap-2 justify-center my-4">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className={`px-4 py-2 rounded-lg font-semibold shadow
                ${
                  formData[step.key] === opt
                    ? "bg-sky-600 text-white"
                    : "bg-orange-200 text-orange-800 hover:bg-orange-300"
                } transition-all`}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case "selectLocation":
        return (
          <div className="relative w-full max-w-[350px] mx-auto mt-2">
            <img
              src={basketballFullCourt}
              alt="court"
              className="w-full cursor-crosshair rounded-lg border shadow"
              onClick={handleClickPosition}
            />
            <svg
              className="absolute left-0 top-0 w-full h-full pointer-events-none"
              style={{ zIndex: 2 }}
            >
              {/* Overlay ngoài sân */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="10%"
                fill="black"
                fillOpacity="0.30"
              />
              <rect
                x="0"
                y="90%"
                width="100%"
                height="10%"
                fill="black"
                fillOpacity="0.30"
              />
              <rect
                x="0"
                y="0"
                width="6%"
                height="100%"
                fill="black"
                fillOpacity="0.30"
              />
              <rect
                x="94%"
                y="0"
                width="6%"
                height="100%"
                fill="black"
                fillOpacity="0.30"
              />
              {/* Overlay vùng 2PT/3PT như cũ */}
              {eventType === "2-Point Score" && (
                <>
                  <mask id="in-2pt-area">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle cx="12.75%" cy="50%" r="24.25%" fill="black" />
                    <circle cx="87%" cy="50%" r="24.25%" fill="black" />
                  </mask>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.23"
                    mask="url(#in-2pt-area)"
                  />
                </>
              )}
              {eventType === "3-Point Score" && (
                <>
                  <mask id="out-3pt-area">
                    <rect x="0" y="0" width="100%" height="100%" fill="black" />
                    <circle cx="8%" cy="50%" r="23.5%" fill="white" />
                    <circle cx="92%" cy="50%" r="23.5%" fill="white" />
                  </mask>
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="black"
                    fillOpacity="0.23"
                    mask="url(#out-3pt-area)"
                  />
                </>
              )}
            </svg>
            {courtPosition && (
              <div
                className="absolute w-4 h-4 bg-red-600 rounded-full border-2 border-white"
                style={{
                  left: `${courtPosition.x * 100}%`,
                  top: `${courtPosition.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              />
            )}
          </div>
        );
      default:
        return (
          <p className="text-gray-500 italic">
            ⚠️ Chưa hỗ trợ kiểu step: {step.type}
          </p>
        );
    }
  };

  // UI
  return (
    <div className="w-full mt-2 px-4 bg-white flex flex-col items-center justify-center h-full">
      {toast && (
        <EventToastNoti message={toast} onClose={() => setToast(null)} />
      )}
      {!eventType ? (
        <div className="grid grid-cols-2 gap-3 my-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setEventType(type);
                setStepIndex(0);
                setFormData({});
                setCourtPosition(null);
              }}
              className="bg-tgray hover:bg-studiobg text-orange-900 px-3 py-3 rounded-xl shadow font-semibold text-md"
            >
              {type}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="">
            <h2 className="text-lg font-bold mb-3 text-center text-sky-700 tracking-wide">
              {steps[stepIndex]?.label || "Step"}
            </h2>
            {renderStep()}
          </div>
          <div className="flex items-center justify-between mt-5 gap-2 w-full px-[60px]">
            <button
              onClick={() =>
                stepIndex === 0 ? resetAll() : setStepIndex((prev) => prev - 1)
              }
              className="text-[15px] text-blue-600 font-semibold hover:underline"
            >
              ← Quay lại
            </button>
            {onSubmit && (courtPosition || eventType === "Free Throw") && (
              <button
                onClick={handleSubmit}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
              >
                {editingEvent ? "Cập nhật Event" : "Tạo Event"}
              </button>
            )}
            {eventType === "Free Throw" && onSubmit && (
              <button
                onClick={handleSubmit}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
              >
                {editingEvent ? "Cập nhật Event" : "Tạo Event"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventCreateStepsV2;
