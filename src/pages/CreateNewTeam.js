import React, { useState, useRef, useEffect } from "react";
import { FileUploaderMinimal } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import teamAPI from "../api/teamAPI";
import playerAPI from "../api/playerAPI";
import HaftCourt from "../assets/court/Basketball_half_court.svg";

const positions = ["PG", "SG", "SF", "PF", "C"];

const CreateNewTeam = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const formRef = useRef(null);
  const dropdownPlayerRef = useRef(null);

  const [formData, setFormData] = useState({ name: "" });
  const [logoPreview, setLogoPreview] = useState(null);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [openPlayerDropdown, setOpenPlayerDropdown] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    if (teamId) {
      fetchTeam();
    }
    fetchPlayers();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await teamAPI.getTeamById(teamId);
      setFormData(res.data);
      setLogoPreview(res.data.avatar);
      if (res.data?.roster.length > 0) {
        let roster = [];
        res.data.roster.map((p) => {
          roster.push({
            _id: p.player._id,
            position: [p.player.position?.[0]],
            name: p.player.name,
          });
          setSelectedPlayers(roster);
          console.log(roster);
        });
      }
    } catch (err) {
      console.error("Failed to load team", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await playerAPI.getAllPlayers();
      setPlayers(res.data);
    } catch (err) {
      console.error("Failed to load players", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAfterUpload = (fileInfo) => {
    if (!fileInfo || !fileInfo.cdnUrl) return;
    if (!fileInfo) {
      handleReset();
      return;
    }

    setLogoPreview(fileInfo.allEntries[0].cdnUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Tên đội là bắt buộc.");
      return;
    }
    console.log(formData);
    const payload = {
      name: formData.name,
      avatar: logoPreview,
      roster: selectedPlayers.map((p) => {
        return { player: p._id };
      }),
    };

    if (teamId) {
      try {
        await teamAPI.updateTeam(teamId, payload);
        setShowSuccessModal(true);
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tạo đội.");
      }
    } else {
      try {
        await teamAPI.createTeam(payload);
        setShowSuccessModal(true);
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tạo đội.");
      }
    }
  };

  useEffect(() => {
    console.log(selectedPlayers);
  }, [selectedPlayers]);

  const handleReset = () => {
    setFormData({ name: "" });
    setLogoPreview(null);
    setSelectedPlayers([]);
    setError("");
  };

  const toggleSelectPlayer = (player) => {
    const exists = selectedPlayers.find((p) => p._id === player._id);
    if (exists) {
      setSelectedPlayers((prev) => prev.filter((p) => p._id !== player._id));
    } else {
      setSelectedPlayers((prev) => [...prev, player]);
    }
  };

  return (
    <div className="page-container flex items-center justify-center overflow-hidden">
      <div
        ref={formRef}
        className="bg-white w-full h-full rounded-xl shadow-lg px-8 py-3 flex gap-10"
      >
        {/* Form bên trái */}
        <div className="w-full md:w-2/3 space-y-5">
          <h1 className="text-2xl font-bold text-center mb-4">
            {teamId ? "Chỉnh sửa đội bóng" : "Tạo đội bóng mới 🏀"}
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Tên đội</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Logo đội (JPG, PNG)
              </label>
              <FileUploaderMinimal
                pubkey="effd4083340611ab571c"
                multiple={false}
                onChange={handleAfterUpload}
                locale="en"
                tabs="file url camera"
              />
            </div>

            <div className="w-full relative" ref={dropdownPlayerRef}>
              <label className="block font-medium mb-1">Chọn cầu thủ</label>
              <div
                onClick={() => setOpenPlayerDropdown(!openPlayerDropdown)}
                className="border px-4 py-2 rounded-lg cursor-pointer bg-white hover:border-blue-500 flex items-center justify-between"
              >
                {selectedPlayers.length > 0
                  ? `${selectedPlayers.length} cầu thủ đã chọn`
                  : "Chọn cầu thủ ▼"}
              </div>
              {openPlayerDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {players.map((player) => {
                    const selected = selectedPlayers.find(
                      (p) => p._id === player._id
                    );
                    return (
                      <div
                        key={player._id}
                        onClick={() => toggleSelectPlayer(player)}
                        className={`px-4 py-2 cursor-pointer flex justify-between items-center ${
                          selected
                            ? "bg-blue-100 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span>{player.name}</span>
                        <span className="text-sm text-gray-500">
                          {player.position?.[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Tạo đội
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Preview bên phải */}
        <div className="w-1/3 bg-gray-50 rounded-xl shadow-inner hidden md:flex flex-col items-center justify-center border-l pl-6">
          <div className="text-center">
            <img
              src={
                logoPreview ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="Logo Preview"
              className="w-40 h-40 object-contain bg-white border rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">
              {formData.name || "Tên đội bóng"}
            </h2>
          </div>
          <div className="mt-4 w-full">
            <h3 className="text-center font-semibold mb-2">
              Cầu thủ theo vị trí
            </h3>
            <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
              <img src={HaftCourt} alt="Sơ đồ sân" className="w-[80%]" />
              {positions.map((pos) => {
                const player = selectedPlayers.find(
                  (p) => p.position?.[0] === pos
                );
                const [top, left] = {
                  PG: ["60%", "50%"],
                  SG: ["50%", "25%"],
                  SF: ["45%", "75%"],
                  PF: ["30%", "30%"],
                  C: ["20%", "50%"],
                }[pos];

                return (
                  <div
                    key={pos}
                    className={`absolute px-3 py-1 rounded-full text-sm shadow transition ${
                      player
                        ? "bg-blue-600 text-white scale-110"
                        : "bg-white text-gray-500"
                    }`}
                    style={{
                      top,
                      left,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {pos}
                    {player ? ` - ${player.name}` : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Success */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-4">
              {teamId ? "✅ Update thành công!" : "✅ Tạo đội thành công!"}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bạn muốn làm gì tiếp theo?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleReset();
                  setShowSuccessModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ➕ Tạo thêm
              </button>
              <button
                onClick={() => navigate("/?tab=teams")}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                📋 Danh sách đội
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewTeam;
