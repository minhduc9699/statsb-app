import React from "react";

const PlayersFilter = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="p-[16px]">
      <div className="text-[20px] pb-[22px] text-start">Player info</div>
      <div className="w-full space-y-[16px]">
        {/* Game Type */}
        <div className="match-type">
          <div className="text-[16px] pb-[8px] text-start">Season</div>
          <select
            name="season"
            onChange={handleChange}
            value={filters.season}
            className="p-2 border rounded shadow-lg w-full"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
        <div className="team-name">
          {/* Team Name */}
          <div className="text-[16px] pb-[8px] text-start">Team Name</div>
          <div className="flex flex-col">
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={filters.teamName}
              onChange={handleChange}
              className="p-2 border rounded flex-1 shadow-lg w-full"
            />
          </div>
        </div>

        <div className="position">
          <div className="text-[16px] pb-[8px] text-start">Position</div>
          {/* Sort Options */}
          <select
            name="position"
            onChange={handleChange}
            value={filters.sortBy}
            className="p-2 border rounded shadow-lg w-full"
          >
            <option value="points">SG</option>
            <option value="assists">C</option>
            <option value="rebounds">PF</option>
            <option value="rebounds">SF</option>
            <option value="rebounds">PG</option>
          </select>
        </div>

        <div className="points">
          <div className="text-[16px] pb-[8px] text-start">
            Points Range: {filters.minPoints ? filters.minPoints : "00"} -{" "}
            {filters.maxPoints ? filters.maxPoints : "00"}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              name="minPoints"
              min="0"
              max="100"
              value={filters.minPoints}
              onChange={handleChange}
              className="w-full"
            />
            <input
              type="range"
              name="maxPoints"
              min="0"
              max="100"
              value={filters.maxPoints}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="assists">
          <div className="text-[16px] pb-[8px] text-start">
            Assist Range: {filters.minAssists ? filters.minAssists : "00"} -{" "}
            {filters.maxAssists ? filters.maxAssists : "00"}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              name="minAssists"
              min="0"
              max="20"
              value={filters.minAssists}
              onChange={handleChange}
              className="w-full"
            />
            <input
              type="range"
              name="maxAssists"
              min="0"
              max="20"
              value={filters.maxAssists}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="rebounds">
          <div className="text-[16px] pb-[8px] text-start">
            Rebounds Range: {filters.minRebounds ? filters.minRebounds : "00"} -{" "}
            {filters.maxRebounds ? filters.maxRebounds : "00"}
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              name="minRebounds"
              min="0"
              max="20"
              value={filters.minRebounds}
              onChange={handleChange}
              className="w-full"
            />
            <input
              type="range"
              name="maxRebounds"
              min="0"
              max="20"
              value={filters.maxRebounds}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="sort">
          <div className="text-[16px] pb-[8px] text-start">Sort By</div>
          {/* Sort Options */}
          <select
            name="sortBy"
            onChange={handleChange}
            value={filters.sortBy}
            className="p-2 border rounded shadow-lg w-full"
          >
            <option value="points">Points</option>
            <option value="assists">Assists</option>
            <option value="rebounds">Rebounds</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PlayersFilter;
