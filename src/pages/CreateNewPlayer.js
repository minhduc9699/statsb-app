import React, { useState, useRef, useEffect } from "react";
import { FileUploaderMinimal } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

import { useNavigate, useParams } from "react-router-dom";
import playerAPI from "../api/playerAPI";
import teamAPI from "../api/teamAPI";
import gsap from "gsap";
import HaftCourt from "../assets/court/Basketball_half_court.svg";

const CreateNewPlayer = () => {
  const navigate = useNavigate();
    const { playerId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    jerseyNumber: "",
    weight: "",
    height: "",
    position: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    if(playerId){
      fetchPlayer();
    }
    fetchTeams();
  }, []);

  const fetchPlayer = async () => {
    try {
      const res = await playerAPI.getPlayerById(playerId);
      setFormData({
        ...res.data,
        position: res.data.position[0]});
      setAvatarPreview(res.data.avatar);
      
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await teamAPI.getAllTeams();
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Tên cầu thủ là bắt buộc.");
      return;
    }
    console.log(formData);

    const payload = {
      name: formData.name,
      avatar: avatarPreview,
      jerseyNumber: formData.jerseyNumber,
      weight: formData.weight,
      height: formData.height,
      position: formData.position ? [formData.position] : [],
    };
    console.log(payload);
    if (playerId) {
      try {
        await playerAPI.updatePlayer(playerId, payload);
        setShowSuccessModal(true);
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tạo cầu thủ.");
      }
    } else {
      try {
        await playerAPI.createPlayer(payload);
        setShowSuccessModal(true);
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tạo cầu thủ.");
      }
    }
  };

  const toggleSelect = (team) => {
    if (selectedTeam === team) {
      setSelectedTeam(null);
    } else {
      setSelectedTeam(team);
    }
  };

  const onCreateNew = () => {
    navigate("/team");
  };

  const handleReset = () => {
    setFormData({
      name: "",
      jerseyNumber: "",
      weight: "",
      height: "",
      position: "",
    });
    setAvatarPreview(null);
    setError("");
  };
  const handleAfterUpload = (file) => {
    setAvatarPreview(file.allEntries[0].cdnUrl);
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
            { playerId ? 'Chỉnh sửa cầu thủ 🏀' : 'Tạo cầu thủ mới 🏀'}
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">Tên cầu thủ</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Số áo</label>
                <input
                  name="jerseyNumber"
                  value={formData.jerseyNumber}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                  type="number"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Vị trí</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                >
                  <option value="">-- Chọn vị trí --</option>
                  <option value="PG">PG - Point Guard</option>
                  <option value="SG">SG - Shooting Guard</option>
                  <option value="SF">SF - Small Forward</option>
                  <option value="PF">PF - Power Forward</option>
                  <option value="C">C - Center</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Cân nặng (kg)</label>
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Chiều cao (cm)</label>
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Ảnh đại diện (JPG, PNG)
              </label>
              <FileUploaderMinimal
                pubkey="effd4083340611ab571c"
                multiple={false}
                onChange={(fileInfo) => {
                  handleAfterUpload(fileInfo);
                }}
                locale="en"
                tabs="file url camera"
              />
            </div>
            <div className="w-full relative" ref={dropdownRef}>
              <div
                onClick={() => setOpen(!open)}
                className="border px-4 py-2 rounded-lg cursor-pointer bg-white hover:border-blue-500 flex items-center justify-between"
              >
                {selectedTeam ? `${selectedTeam.name}` : "Chọn đội"}

                <span>▼</span>
              </div>

              {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {teams.map((team) => {
                    return (
                      <div
                        key={team._id}
                        onClick={() => toggleSelect(team)}
                        className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-100`}
                      >
                        <span>{team.name}</span>
                        <span>{team.avatar}</span>
                      </div>
                    );
                  })}
                  <div
                    onClick={onCreateNew}
                    className="border-t px-4 py-2 text-blue-600 hover:bg-green-100 cursor-pointer"
                  >
                    ➕ Tạo team mới
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {playerId ? 'Cập nhật' : 'Tạo cầu thủ'}
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
          <div className="relative w-full text-center flex items-center justify-center p-8 gap-6">
            <img
              src={
                avatarPreview ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="Avatar"
              className="w-40 h-40 object-cover rounded-full"
            />
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-semibold">
                {formData.name || "Tên cầu thủ"}
              </h2>
              <p className="text-gray-600">#{formData.jerseyNumber || "--"}</p>
              <p className="mt-2 text-sm text-gray-700">
                {formData.position || "--"} | {formData.height || "--"} cm |{" "}
                {formData.weight || "--"} kg
              </p>
            </div>
          </div>
          <div className="mt-4 w-full">
            <h3 className="text-center font-semibold mb-2">Vị trí trên sân</h3>
            <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
              <img src={HaftCourt} alt="Avatar" className="w-[80%] " />
              {/* PG */}
              <div
                className={`absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2
                ${
                  formData.position === "PG"
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white"
                }
                px-3 py-1 rounded-full shadow-sm text-sm transition`}
              >
                PG
              </div>

              {/* SG */}
              <div
                className={`absolute top-[50%] left-[25%] transform -translate-x-1/2 -translate-y-1/2
                ${
                  formData.position === "SG"
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white"
                }
                px-3 py-1 rounded-full shadow-sm text-sm transition`}
              >
                SG
              </div>

              {/* SF */}
              <div
                className={`absolute top-[45%] left-[75%] transform -translate-x-1/2 -translate-y-1/2
                ${
                  formData.position === "SF"
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white"
                }
                px-3 py-1 rounded-full shadow-sm text-sm transition`}
              >
                SF
              </div>

              {/* PF */}
              <div
                className={`absolute top-[20%] left-[30%] transform -translate-x-1/2 -translate-y-1/2
                ${
                  formData.position === "PF"
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white"
                }
                px-3 py-1 rounded-full shadow-sm text-sm transition`}
              >
                PF
              </div>

              {/* C */}
              <div
                className={`absolute top-[20%] left-[50%] transform -translate-x-1/2 -translate-y-1/2
                ${
                  formData.position === "C"
                    ? "bg-blue-600 text-white scale-110"
                    : "bg-white"
                }
                px-3 py-1 rounded-full shadow-sm text-sm transition`}
              >
                C
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-4">
              { playerId ? '✅ Update cầu thủ thành công!' : '✅ Tạo cầu thủ thành công!'}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bạn muốn làm gì tiếp theo?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleReset(); // reset form
                  setShowSuccessModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ➕ Tạo thêm
              </button>
              <button
                onClick={() => navigate("/?tab=players")}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                📋 Danh sách cầu thủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewPlayer;
