// eventStepConfigBackendEnum.js
export const eventStepConfigv2 = {
  "2-Point Score": {
    steps: [
      { key: "team", type: "selectTeam", label: "Chọn đội thực hiện" },
      { key: "player", type: "selectPlayer", label: "Chọn cầu thủ thực hiện" },
      {
        key: "shotType",
        type: "selectType",
        options: ["Layup", "Dunk", "Jump Shot", "Hook Shot"],
        label: "Loại cú ném",
      },
      {
        key: "outcome",
        type: "selectType",
        options: ["Made", "Missed", "Blocked"],
        label: "Kết quả",
      },
      { key: "location", type: "selectLocation", label: "Vị trí ném" },
    ],
  },
  "3-Point Score": {
    steps: [
      { key: "team", type: "selectTeam", label: "Chọn đội thực hiện" },
      { key: "player", type: "selectPlayer", label: "Chọn cầu thủ thực hiện" },
      {
        key: "shotType",
        type: "selectType",
        options: ["Three Point"],
        label: "Loại cú ném",
      },
      {
        key: "outcome",
        type: "selectType",
        options: ["Made", "Missed", "Blocked"],
        label: "Kết quả",
      },
      { key: "location", type: "selectLocation", label: "Vị trí ném" },
    ],
  },
  Rebound: {
    steps: [
      { key: "team", type: "selectTeam", label: "Chọn đội rebound" },
      { key: "player", type: "selectPlayer", label: "Chọn cầu thủ" },
      {
        key: "reboundType",
        type: "selectType",
        options: ["Offensive", "Defensive"],
        label: "Loại rebound",
      },
      { key: "location", type: "selectLocation", label: "Vị trí rebound" },
    ],
  },
  Foul: {
    steps: [
      { key: "team", type: "selectTeam", label: "Chọn đội phạm lỗi" },
      { key: "player", type: "selectPlayer", label: "Chọn cầu thủ phạm lỗi" },
      {
        key: "foulType",
        type: "selectType",
        options: ["Personal", "Technical", "Flagrant", "Unsportsmanlike"],
        label: "Loại lỗi",
      },
      { key: "location", type: "selectLocation", label: "Vị trí phạm lỗi" },
    ],
  },
  Turnover: {
    steps: [
      { key: "team", type: "selectTeam", label: "Đội mất bóng" },
      { key: "player", type: "selectPlayer", label: "Cầu thủ mất bóng" },
      { key: "location", type: "selectLocation", label: "Vị trí mất bóng" },
    ],
  },
  Steal: {
    steps: [
      { key: "team", type: "selectTeam", label: "Đội cướp bóng" },
      { key: "player", type: "selectPlayer", label: "Cầu thủ cướp bóng" },
      { key: "location", type: "selectLocation", label: "Vị trí cướp bóng" },
    ],
  },
  Block: {
    steps: [
      { key: "team", type: "selectTeam", label: "Đội block" },
      { key: "player", type: "selectPlayer", label: "Cầu thủ block" },
      { key: "location", type: "selectLocation", label: "Vị trí block" },
    ],
  },
  "Free Throw": {
    steps: [
      { key: "team", type: "selectTeam", label: "Đội ném phạt" },
      { key: "player", type: "selectPlayer", label: "Cầu thủ ném phạt" },
      {
        key: "outcome",
        type: "selectType",
        options: ["Made", "Missed"],
        label: "Kết quả ném phạt",
      },
    ],
  },
};
