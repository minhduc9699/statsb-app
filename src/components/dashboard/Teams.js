import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import teamAPI from "../../api/teamAPI";
import TeamsFilter from "./filters/TeamsFilter";

import infoIcon from "../../assets/info-icon.png";
import Delete from "../../assets/delete.png";

const Bonston =
  "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg";

const Teams = () => {
  const navigate = useNavigate();
  const [teamsList, setTeamsList] = useState([]);
  const [filters, setFilters] = useState({
    season: "",
    name: "",
    minMatchesPlayed: "",
    minWins: "",
    minLosts: "",
    sortBy: "",
  });
  const [currentTeamId, setCurrentTeamId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchTeams();
    };
    fetchAll();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await teamAPI.getAllTeams();
      setTeamsList(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const popUpDelete = (id) => {
    setCurrentTeamId(id);
    setIsOpen(true);
  };

  const onConfirmDelete = async () => {
    await teamAPI.deleteTeam(currentTeamId);
    await fetchTeams();
    setIsOpen(false);
  };

  return (
    <>
      <div className="bg-dark text-white font-roboto text-[14px] flex items-center justify-between px-[24px] py-[10px]">
        <div className="">Teams List</div>
        <button className="bg-green flex items-center p-[12px] rounded-[10px] space-x-[5px]">
          <img className="w-[10px] h-[10px]" src={infoIcon} alt="info-icon" />
          <span onClick={() => navigate("/team")}>Create New Team</span>
        </button>
      </div>
      <div className="grid grid-cols-12 gap-[6px] px-[24px] bg-gray-100 overflow-hidden h-full">
        <div className="col-span-12 matches-list">
          {teamsList.length > 0 && (
            <div>
              <div className="bg-gray-100 text-tgray font-bold text-[14px] p-2 w-full grid grid-cols-12  p-[10px]">
                <div className="flex items-center justify-center col-span-2">
                  Teams
                </div>
                <div className="flex items-center justify-center col-span-1">
                  Gender
                </div>
                <div className="flex items-center justify-center col-span-2">
                  Total Matches Played
                </div>
                <div className="flex items-center justify-center col-span-4">
                  Roster
                </div>
                <div className="flex items-center justify-center col-span-2">
                  Created At
                </div>
                <div className="flex items-center justify-center col-span-1"></div>
              </div>
              {teamsList?.map((team, index) => (
                <div
                  onClick={() => navigate(`/team/${team._id}`)}
                  key={index}
                  className="team-item p-[10px] my-[8px] bg-white shadow-lg group cursor-pointer hover:scale-[1.02] transition duration-300 ease-in-out"
                >
                  <div className="grid grid-cols-12">
                    <div className="flex items-center justify-start space-x-[20px] col-span-2">
                      <img
                        src={
                          team.avatar ||
                          "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        }
                        alt="logo"
                        className="w-16 h-16 object-contain bg-white border rounded-full"
                      />
                      <div className="text-[14px] font-bold">{team.name}</div>
                    </div>
                    <div className="flex items-center justify-center col-span-1">
                      Male
                    </div>
                    <div className="flex items-center justify-center col-span-2">
                      02
                    </div>
                    <div className="flex items-center justify-between col-span-4">
                      <div className="flex flex-col space-y-[10px] items-center justify-start w-1/2">
                        <div className="flex items-center justify-start space-x-[10px] w-full">
                          <span className="text-[20px] font-bold"></span>
                          <span>Dr. Susan Bins</span>
                        </div>
                        <div className="flex items-center justify-start space-x-[10px] w-full">
                          <span className="text-[20px] font-bold"></span>
                          <span>Kobe Bryant</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-[10px] items-start justify-start w-1/2">
                        <div className="flex items-center justify-start space-x-[10px] w-full">
                          <span className="text-[20px] font-bold"></span>
                          <span>Ida Grimes</span>
                        </div>
                        <div className="flex items-center justify-start space-x-[10px] w-full">
                          <span className="text-[20px] font-bold"></span>
                          <span>Kobe Bryant</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center col-span-2 text-tgray text-[12px]">
                      {formatDate(team.createdAt)}
                    </div>
                    <div className="flex items-center justify-center col-span-1">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          popUpDelete(team._id);
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
            <h2 className="text-lg font-semibold mb-4">
              Xác nhận xoá đội bóng
            </h2>
            <p className="mb-6 text-sm text-gray-700">
              Bạn có chắc chắn muốn xoá đội bóng này không? Hành động này không
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

export default Teams;
