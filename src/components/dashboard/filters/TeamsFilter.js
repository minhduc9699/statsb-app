import React from "react";

const TeamsFilter = ({ filters, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="p-[16px]">
      <div className="text-[20px] pb-[22px] text-start">Team info</div>
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

        <div className="min-matches-played">
          <div className="text-[16px] pb-[8px] text-start">
            Min Matches Played:{" "}
            {filters.minMatchesPlayed ? filters.minMatchesPlayed : "00"}
          </div>
          <input
            type="range"
            name="minMatchesPlayed"
            value={filters.minMatchesPlayed}
            onChange={handleChange}
          />
        </div>

        <div className="min-wins">
          <div className="text-[16px] pb-[8px] text-start">
            Min Wins: {filters.minWins ? filters.minWins : "00"}
          </div>
          <input
            type="range"
            name="minWins"
            value={filters.minWins}
            onChange={handleChange}
          />
        </div>

        <div className="min-losts">
          <div className="text-[16px] pb-[8px] text-start">
            Min Losts: {filters.minLosts ? filters.minLosts : "00"}
          </div>
          <input
            type="range"
            name="minLosts"
            value={filters.minLosts}
            onChange={handleChange}
          />
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
            <option value="matchesPlayed">Matches Played</option>
            <option value="totalPoints">Total Points</option>
            <option value="winRate">Win Rate</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TeamsFilter;
