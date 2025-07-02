import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import playerAPI from "../../api/playerAPI";
import PlayersFilter from "./filters/PlayersFilter";

import infoIcon from "../../assets/info-icon.png";
import Delete from "../../assets/delete.png";

const Players = () => {
  const navigate = useNavigate();
  const [playersList, setPlayersList] = useState([]);
  const [filters, setFilters] = useState({
    season: "",
    team: "",
    minPoints: "",
    minAssists: "",
    minRebounds: "",
    sortBy: "",
  });
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchPlayers();
    };
    fetchAll();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await playerAPI.getAllPlayers();
      setPlayersList(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const allPlayers = await playerAPI.getAllPlayers();
        let filtered = [...allPlayers];

        // Lọc theo mùa giải
        if (filters.season) {
          filtered = filtered.filter((p) => p.season === filters.season);
        }

        // Lọc theo đội
        if (filters.team) {
          filtered = filtered.filter((p) =>
            p.team.toLowerCase().includes(filters.team.toLowerCase())
          );
        }

        // Lọc theo các chỉ số
        if (filters.minPoints) {
          filtered = filtered.filter(
            (p) => p.points >= Number(filters.minPoints)
          );
        }

        if (filters.minAssists) {
          filtered = filtered.filter(
            (p) => p.assists >= Number(filters.minAssists)
          );
        }

        if (filters.minRebounds) {
          filtered = filtered.filter(
            (p) => p.rebounds >= Number(filters.minRebounds)
          );
        }

        // Sắp xếp
        if (filters.sortBy) {
          filtered.sort((a, b) => b[filters.sortBy] - a[filters.sortBy]);
        }

        setPlayersList(filtered);
      } catch (err) {
        console.error("Lỗi khi tải danh sách cầu thủ:", err);
      }
    };

    fetchPlayers();
  }, [filters]);

  const popUpDelete = (id) => {
    setCurrentPlayerId(id);
    setIsOpen(true);
  };

  const onConfirmDelete = async () => {
    await playerAPI.deletePlayer(currentPlayerId);
    await fetchPlayers();
    setIsOpen(false);
  };

  const isValidObject = (obj) =>
    obj &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj).length > 0;

  return (
    <>
      <div className="bg-dark text-white font-roboto text-[14px] flex items-center justify-between px-[24px] py-[10px]">
        <div className="">Teams List</div>
        <button className="bg-green flex items-center p-[12px] rounded-[10px] space-x-[5px]">
          <img className="w-[10px] h-[10px]" src={infoIcon} alt="info-icon" />
          <span onClick={() => navigate("/player")}>Create New Player</span>
        </button>
      </div>
      <div className="grid grid-cols-12 gap-[6px] px-[24px] bg-gray-100 overflow-hidden h-full">
        <div className="col-span-12 matches-list">
          {playersList.length > 0 && (
            <div>
              <div className="bg-gray-100 text-tgray font-bold text-[14px] p-2 w-full grid grid-cols-12  p-[10px]">
                <div className="flex items-center justify-center col-span-4"></div>
                <div className="flex items-center justify-center col-span-1">
                  Position
                </div>
                <div className="flex items-center justify-center col-span-1">
                  Weight
                </div>
                <div className="flex items-center justify-center col-span-1">
                  Height
                </div>
                <div className="flex items-center justify-center col-span-2">
                  Team
                </div>
                <div className="flex items-center justify-center col-span-2">
                  League
                </div>
                <div className="flex items-center justify-center col-span-1"></div>
              </div>
              {playersList.map((player, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/player/${player._id}`)}
                  className="player-item p-[10px] my-[8px] bg-white shadow-lg group cursor-pointer hover:scale-[1.02] transition duration-300 ease-in-out"
                >
                  <div className="grid grid-cols-12">
                    <div className="flex items-center justify-start space-x-[20px] col-span-4">
                      <img
                        src={
                          player.avatar ||
                          "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        }
                        alt="avatar"
                        className="w-16 h-16 object-cover rounded-full border"
                      />
                      <span className="text-[14px] font-bold">
                        {player.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center col-span-1">
                      {player.position}
                    </div>
                    <div className="flex items-center justify-center col-span-1">
                      {player.weight} <span className="text-[10px]">kg</span>
                    </div>
                    <div className="flex items-center justify-center w-full col-span-1">
                      {player.height}
                      <span className="text-[10px]">cm</span>
                    </div>

                    <div className="flex items-center justify-center col-span-2 text-dark text-[12px]">
                      Golden State Warriors
                    </div>
                    <div className="flex items-center justify-center col-span-2 text-dark text-[12px]">
                      Read&Go League
                    </div>
                    <div className="flex items-center justify-center col-span-1">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          popUpDelete(player._id);
                        }}
                        className="flex items-center justify-center space-x-[10px]"
                      >
                        <img
                          src={Delete}
                          alt="delete-icon"
                          className="w-[20px] h-[20px]"
                        />
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
            <h2 className="text-lg font-semibold mb-4">Xác nhận xoá cầu thủ</h2>
            <p className="mb-6 text-sm text-gray-700">
              Bạn có chắc chắn muốn xoá cầu thủ này không? Hành động này không
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
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDelete();
                }}
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

export default Players;
