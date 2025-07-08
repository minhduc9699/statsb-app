import React, { useState, useEffect } from "react";
import matchAPI from "../../api/matchAPI";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import GamesFilter from "./filters/GamesFilter";

import infoIcon from "../../assets/info-icon.png";
import Play from "../../assets/video-player/play-2.png";
import Edit from "../../assets/edit.png";
import Delete from "../../assets/delete.png";

const Bonston =
  "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg";
const Golden =
  "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg";

const Games = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    gameType: "",
    startDate: "",
    endDate: "",
    teamName: "",
    resultType: "",
    sortBy: "newest",
  });
  const [matchesList, setMatchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchMatches();
    };
    fetchAll();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await matchAPI.getAllMatches();
      console.log(res.data);
      setMatchesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let filtered = [...matchesList];

    // Lọc theo gameType
    if (filters.gameType) {
      filtered = filtered.filter((m) => m.gameType === filters.gameType);
    }

    // Lọc theo date
    if (filters.startDate) {
      filtered = filtered.filter(
        (m) => new Date(m.date) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (m) => new Date(m.date) <= new Date(filters.endDate)
      );
    }

    // Lọc theo team
    if (filters.teamName) {
      filtered = filtered.filter((m) =>
        [m.homeTeam, m.awayTeam].some((t) =>
          t.toLowerCase().includes(filters.teamName.toLowerCase())
        )
      );
    }

    // Lọc theo result
    if (filters.resultType && filters.teamName) {
      filtered = filtered.filter((match) => {
        const isHome =
          match.homeTeam.toLowerCase() === filters.teamName.toLowerCase();
        const homeScore = match.teamStats.home.points;
        const awayScore = match.teamStats.away.points;

        let result =
          homeScore === awayScore
            ? "draw"
            : homeScore > awayScore
            ? "win"
            : "lose";

        if (!isHome) {
          result =
            result === "win" ? "lose" : result === "lose" ? "win" : "draw";
        }

        return result === filters.resultType;
      });
    }

    // Sắp xếp
    if (filters.sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters.sortBy === "highestScore") {
      filtered.sort(
        (a, b) =>
          b.teamStats.home.points +
          b.teamStats.away.points -
          (a.teamStats.home.points + a.teamStats.away.points)
      );
    } else if (filters.sortBy === "lowestScore") {
      filtered.sort(
        (a, b) =>
          a.teamStats.home.points +
          a.teamStats.away.points -
          (b.teamStats.home.points + b.teamStats.away.points)
      );
    }

    setMatchesList(filtered);
  }, [filters]);

  const popUpDelete = (id) => {
    setCurrentMatchId(id);
    setIsOpen(true);
  };

  const onConfirmDelete = async () => {
    await matchAPI.deleteMatch(currentMatchId);
    await fetchMatches();
    setIsOpen(false);
  };
  return (
    <>
      <div className="bg-dark text-white font-roboto text-[14px] flex items-center justify-between px-[24px] py-[10px]">
        <div className="">Matches List</div>
        <button
          onClick={() => navigate("/match-studio")}
          className="bg-green flex items-center p-[12px] rounded-[10px] space-x-[5px]"
        >
          <img className="w-[10px] h-[10px]" src={infoIcon} alt="info-icon" />
          <span>Create New Match</span>
        </button>
      </div>
      <div className="matches grid grid-cols-12 gap-[6px] px-[24px] bg-gray-100 min-h-0 overflow-hidden">
        <div className="col-span-12 min-h-0 overflow-hidden matches-list">
          {matchesList?.length > 0 && (
            <div>
              <div className="bg-gray-100 text-tgray font-bold text-[14px] p-2 w-full grid grid-cols-12  p-[10px]">
                <div className="flex items-center justify-center col-span-1"></div>
                <div className="flex items-center justify-center col-span-2">
                  Game
                </div>
                <div className="flex items-center justify-center col-span-1">
                  Score
                </div>
                <div className="flex items-center justify-center col-span-2">
                  Points
                </div>
                <div className="flex items-center justify-center col-span-2">
                  Rebounds
                </div>
                <div className="flex items-center justify-center col-span-2">
                  Assists
                </div>
                <div className="flex items-center justify-center col-span-2"></div>
              </div>
              {matchesList?.map((match, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/match-studio/${match._id}`)}
                  className="match-item p-[10px] my-[8px] bg-white shadow-lg group cursor-pointer hover:scale-[1.02] transition duration-300 ease-in-out"
                >
                  <div className="grid grid-cols-12">
                    <div className="flex flex-col items-center justify-center text-tgray text-[12px] w-full space-y-[6px] col-span-1">
                      <div className="flex items-center justify-center text-dark text-[14px]">
                        {match.gameType}
                      </div>
                      <div className="flex items-center justify-center">
                        {formatDate(match.createdAt)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center col-span-2 relative">
                      {/* <span className="text-[12px] absolute -top-[8px] right-0 text-tgray flex items-center justify-center w-full">
                        Read&Go League
                      </span> */}
                      <span className="text-[12px] flex items-center justify-start space-x-[10px] py-[8px] w-full border-b border-bordergray">
                        <img
                          src={match.homeTeam?.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                          alt="home-logo"
                          className="w-16 h-16 object-cover rounded-full border"
                        />
                        <div className="text-[14px] font-bold">
                          {match.homeTeam?.name}
                        </div>
                      </span>
                      <span className="text-[12px] flex items-center justify-start space-x-[10px] py-[8px] w-full">
                        <img
                          src={match.awayTeam?.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                          alt="away-logo"
                          className="w-16 h-16 object-cover rounded-full border"
                        />
                        <div className="text-[14px] font-bold">
                          {match.awayTeam?.name}
                        </div>
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center col-span-1">
                      <span className="text-[20px] font-bold flex items-center justify-center py-[8px] w-full border-b border-bordergray">
                        {match.teamStats?.home?.points}
                      </span>
                      <span className="text-[20px] font-bold flex items-center justify-center py-[8px] w-full">
                        {match.teamStats?.away?.points}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center col-span-2">
                      <span className="flex items-center justify-center py-[8px] w-full border-b border-bordergray">
                        <span className="text-[12px] text-tgray">
                          {/* {match.playerStats?.home[0].name}{" "} */}
                        </span>{" "}
                        {/* - {match.playerStats?.home[0].points} */}
                      </span>
                      {/* <span className="flex items-center justify-center py-[8px] w-full">
                        <span className="text-[12px] text-tgray">
                          {match.playerStats?.away[0].name}{" "}
                        </span>{" "}
                        - {match.playerStats?.away[0].points}
                      </span> */}
                    </div>
                    <div className="flex flex-col items-center justify-center col-span-2">
                      {/* <span className="flex items-center justify-center py-[8px] w-full border-b border-bordergray">
                        <span className="text-[12px] text-tgray">
                          {match.playerStats?.home[1].name}{" "}
                        </span>{" "}
                        - {match.playerStats?.home[1].rebounds}
                      </span> */}
                      {/* <span className="flex items-center justify-center py-[8px] w-full">
                        <span className="text-[12px] text-tgray">
                          {match.playerStats?.away[1].name}{" "}
                        </span>{" "}
                        - {match.playerStats?.away[1].rebounds}
                      </span> */}
                    </div>
                    <div className="flex flex-col items-center justify-center col-span-2">
                      {/* <span className="flex items-center justify-center py-[8px] w-full border-b border-bordergray">
                        <span className="text-[12px] text-tgray">
                          {match.playerStats?.home[1].name}{" "}
                        </span>{" "}
                        - {match.playerStats?.home[1].assists}
                      </span> */}
                      {/* <span className="flex items-center justify-center py-[8px] w-full">
                        <span className="text-[12px] text-tgray">
                          {match.playerStats?.away[1].name}{" "}
                        </span>{" "}
                        - {match.playerStats?.away[1].assists}
                      </span> */}
                    </div>
                    <div className="relative flex flex-col items-center justify-center col-span-2 space-y-[4px]">
                      <div className="px-[8px] hidden group-hover:block">
                        <div className="flex items-center justify-start space-x-[6px] w-full">
                          {/* <img src={Play} alt="play" className="w-[14px]" />
                          <div className="text-tgray text-[14px] hover:text-dark">
                            Full Game Video
                          </div> */}
                        </div>
                        <div
                          className="flex items-center justify-start space-x-[6px] w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/match-analytics/${match._id}`);
                          }}
                        >
                          <img src={Play} alt="play" className="w-[14px]" />
                          <div className="text-tgray text-[14px] hover:text-dark">
                            Match Analytics
                          </div>
                        </div>
                        <div
                          onClick={() => navigate(`/match-studio/${match._id}`)}
                          className="flex items-center justify-start space-x-[6px] w-full"
                        >
                          <img src={Edit} alt="play" className="w-[14px]" />
                          <div className="text-tgray text-[14px] hover:text-dark">
                            Edit this match
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            popUpDelete(match._id);
                          }}
                          className="flex items-center justify-start space-x-[6px] w-full"
                        >
                          <img src={Delete} alt="play" className="w-[14px]" />
                          <div className="text-[#ff7171] text-[14px] hover:text-dark">
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 shadow-lg w-[300px]">
            <h2 className="text-lg font-semibold mb-4">
              Xác nhận xoá trận đấu
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              Bạn có chắc chắn muốn xoá trận đấu này không? Hành động này không
              thể hoàn tác.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                onClick={() => setIsOpen(false)}
              >
                Huỷ
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                onClick={() => onConfirmDelete()}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Games;
