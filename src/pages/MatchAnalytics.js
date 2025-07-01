// pages/MatchAnalytics.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import matchAPI from "../api/matchAPI";
import { formatTime } from "../utils/formatTime";
import teamAPI from "../api/teamAPI";
import eventAPI from "../api/eventAPI";

const positions = ["PG", "SG", "SF", "PF", "C"];

const MatchAnalytics = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetchMatch();
        await fetchTeams(res);
        await fetchEvents();
      } catch (error) {
        console.error("Lỗi khi fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const fetchMatch = async () => {
    try {
      const res = await matchAPI.getMatchById(matchId);
      setMatch(res.data);
      return res.data;
    } catch (error) {
      console.error("Lỗi khi fetch match:", error);
      throw error;
    }
  };

  const fetchTeams = async (match) => {
    console.log(match?.homeTeam?._id, match?.awayTeam?._id);

    const homeId = match?.homeTeam?._id;
    const awayId = match?.awayTeam?._id;

    if (!homeId || !awayId) {
      throw new Error("Thiếu thông tin team trong matchData");
    }

    try {
      const [homeRes, awayRes] = await Promise.all([
        teamAPI.getTeamById(homeId),
        teamAPI.getTeamById(awayId),
      ]);
      setHomeTeam(homeRes.data.roster);
      setAwayTeam(awayRes.data.roster);
    } catch (error) {
      console.error("Lỗi khi fetch team:", error);
      throw error;
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await eventAPI.getMatchEvents(matchId);
      console.log(res);
      setEvents(res);
    } catch (error) {
      console.error("Lỗi khi fetch events:", error);
      throw error;
    }
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;
  if (!match) return <div className="p-4">Không tìm thấy trận đấu</div>;

  const stats = [
    "points",
    "assists",
    "blocks",
    "rebounds",
    "turnovers",
    "steals",
    "freeThrows",
  ];

  const positions = ["PG", "SG", "SF", "PF", "C"];

  const getPlayerByPosition = (roster, position) => {
    console.log(roster, position);
    if (roster.length === 0 || !roster) return null;
    return roster?.find((p) => p.player.position === position);
  };

  // Mock timeline shooting events
  const mockShootingEvents = [
    { x: 120, y: 200, type: "2-Point Score", result: "made", team: "home" },
    { x: 240, y: 300, type: "3-Point Score", result: "missed", team: "away" },
    { x: 160, y: 150, type: "2-Point Score", result: "missed", team: "home" },
    { x: 200, y: 220, type: "3-Point Score", result: "made", team: "away" },
  ];

  return (
    <div className="w-full page-container bg-white p-6 space-y-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Phân tích trận đấu
      </h1>

      {/* Phần phân tích thống kê */}
      <div className="grid grid-cols-12 gap-4 items-center px-[40px]">
        {/* Avatar + tên đội Home */}
        <div className="col-span-3 flex flex-col items-end space-y-2 h-full flex items-center">
          <img
            src={match.homeTeam?.avatar}
            alt="home-logo h-full"
            className="w-[200px] h-[200px] object-cover rounded-full border"
          />
          <h3 className="text-sm font-semibold text-right">
            {match.homeTeam?.name}
          </h3>
        </div>

        {/* Thống kê Home */}
        <div className="col-span-1 space-y-2 text-right">
          {stats.map((key) => (
            <div
              key={key}
              className="text-xl font-bold text-gray-800 text-shadow-sm tracking-wide leading-[28px]"
            >
              {match.teamStats?.home?.[key] ?? 0}
            </div>
          ))}
        </div>

        {/* Tiêu đề thống kê */}
        <div className="col-span-4 text-center space-y-2">
          {stats.map((key) => (
            <div
              key={key}
              className="text-gray-600 capitalize leading-[28px] border-b border-gray-300 hover:text-gray-900 hover:border-gray-900"
            >
              {key}
            </div>
          ))}
        </div>

        {/* Thống kê Away */}
        <div className="col-span-1 space-y-2 text-left">
          {stats.map((key) => (
            <div
              key={key}
              className="text-xl font-bold text-gray-800 text-shadow-sm tracking-wide leading-[28px]"
            >
              {match.teamStats?.away?.[key] ?? 0}
            </div>
          ))}
        </div>

        {/* Avatar + tên đội Away */}
        <div className="col-span-3 flex flex-col items-end space-y-2 h-full flex items-center">
          <img
            src={match.awayTeam?.avatar}
            alt="away-logo"
            className="w-[200px] h-[200px] object-cover rounded-full border"
          />
          <h3 className="text-sm font-semibold">{match.awayTeam?.name}</h3>
        </div>
      </div>

      {/* Phần bên dưới: Roster - Events - Field Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Roster */}
        <div className="md:col-span-4">
          <h2 className="text-lg font-bold mb-2">Cầu thủ theo vị trí</h2>
          <div className="grid grid-cols-12 gap-4 text-xs">
            <div className="col-span-4 flex flex-col items-end gap-2">
              {positions.map((pos) => {
                const player = getPlayerByPosition(homeTeam, pos);
                return player ? (
                  <div key={pos} className="flex items-center gap-2">
                    <img
                      src={player.player.avatar}
                      alt=""
                      className="w-4 h-4 rounded-full border"
                    />
                    <span className="font-medium">
                      #{player.player.jerseyNumber}
                    </span>
                    <span>{player.player.name}</span>
                  </div>
                ) : (
                  <div key={pos} className="h-5"></div>
                );
              })}
            </div>

            <div className="col-span-4 flex flex-col items-center gap-2">
              {positions.map((pos) => (
                <div key={pos} className="font-semibold text-gray-600">
                  {pos}
                </div>
              ))}
            </div>

            <div className="col-span-4 flex flex-col items-start gap-2">
              {positions.map((pos) => {
                const player = getPlayerByPosition(awayTeam, pos);
                return player ? (
                  <div key={pos} className="flex items-center gap-2">
                    <img
                      src={player.avatar}
                      alt=""
                      className="w-4 h-4 rounded-full border"
                    />
                    <span className="font-medium">#{player.jerseyNumber}</span>
                    <span>{player.name}</span>
                  </div>
                ) : (
                  <div key={pos} className="h-5"></div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="md:col-span-4">
          <h2 className="text-lg font-bold mb-2">Các sự kiện trong trận</h2>
          <div className="space-y-2 text-sm max-h-[150px] overflow-y-scroll pr-1">
            {events?.length ? (
              events
                .slice()
                .reverse()
                .map((event, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded px-3 py-2 flex justify-between items-center"
                  >
                    <span>
                      {formatTime(event.timestamps?.start)} - {event.type} -{" "}
                      {event.player.name || "Ẩn danh"}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 italic">Chưa có sự kiện nào</p>
            )}
          </div>
        </div>

        {/* Field Chart */}
        <div className="md:col-span-3">
          {/* <h2 className="text-lg font-bold mb-2">Sơ đồ sân</h2>
          <div className="relative w-full aspect-[2/1] bg-green-50 rounded-lg border overflow-hidden">
            {mockShootingEvents.map((e, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full ${
                  e.result === "made"
                    ? e.team === "home"
                      ? "bg-green-600"
                      : "bg-blue-600"
                    : "bg-gray-400"
                }`}
                style={{
                  top: `${e.y}px`,
                  left: `${e.x}px`,
                  transform: "translate(-50%, -50%)",
                }}
                title={`${e.team} - ${e.type} - ${e.result}`}
              ></div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MatchAnalytics;
