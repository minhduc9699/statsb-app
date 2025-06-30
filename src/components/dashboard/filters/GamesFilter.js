import React from "react";

const GamesFilter = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="p-[16px]">
      <div className="text-[20px] pb-[22px] text-start">Match info</div>
      <div className="w-full space-y-[16px]">
        {/* Game Type */}
        <div className="match-type">
          <div className="text-[16px] pb-[8px] text-start">Match Type</div>
          <select
            name="gameType"
            onChange={handleChange}
            value={filters.gameType}
            className="p-2 border rounded w-full shadow-lg"
            placeholder="Match Type"
          >
            <option value="5v5">5v5</option>
            <option value="3v3">3v3</option>
          </select>
        </div>
        <div className="date-range">
          {/* Date Range */}
          <div className="text-[16px] pb-[8px] text-start">Date Range</div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-[4px] w-full mb-[8px]">
              <span className="text-[12px] flex-1 text-start">From :</span>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="p-2 border rounded shadow-lg"
              />
            </div>
            <div className="flex items-center space-x-[4px] w-full">
              <span className="text-[12px] flex-1 text-start">To :</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="p-2 border rounded shadow-lg"
              />
            </div>
          </div>
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
              className="p-2 border rounded flex-1 shadow-lg"
            />
            {/* Result Type (win/lose/draw) */}
            <select
              name="resultType"
              onChange={handleChange}
              value={filters.resultType}
              className="p-2 border rounded shadow-lg"
            >
              <option value="">Result</option>
              <option value="win">Win</option>
              <option value="lose">Lose</option>
              <option value="draw">Draw</option>
            </select>
          </div>
        </div>

        <div className="sort">
          <div className="text-[16px] pb-[8px] text-start">Sort By</div>
          {/* Sort Options */}
          <select
            name="sortBy"
            onChange={handleChange}
            value={filters.sortBy}
            className="p-2 border rounded w-full shadow-lg"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highestScore">Highest Total Score</option>
            <option value="lowestScore">Lowest Total Score</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GamesFilter;
