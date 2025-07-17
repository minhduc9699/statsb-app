import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MatchInfo = () => {
  const matchData = useSelector((state) => state.match.matchDataStore);
  const homeTeam = useSelector((state) => state.match.homeTeam);
  const awayTeam = useSelector((state) => state.match.awayTeam);
  const season = useSelector((state) => state.match.season);
  const events = useSelector((state) => state.match.matchEvents);

  const [score, setScore] = useState({
    home: 0,
    away: 0,
  });

  useEffect(() => {
    console.log(matchData);
  }, []);

  useEffect(() => {
    console.log(matchData?.teamStats);
    
    if (matchData?.teamStats) {
      setScore({
        home: matchData.teamStats.home.points,
        away: matchData.teamStats.away.points,
      });
    }
  }, [matchData]);

  return (
    <div className="w-full h-full p-3 bg-white rounded flex flex-col items-center justify-center">
      <div className="font-bold text-center mb-2 tracking-wider text-gray-700 text-sm">
        Match Info
      </div>
      <div className="text-xs text-gray-500 font-medium tracking-wide mb-2">
        {season}
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col items-center min-w-[90px]">
          <img
            src={homeTeam?.avatar}
            alt={homeTeam?.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
          />
          <div className="text-sm font-semibold mt-1">{homeTeam?.name}</div>
        </div>
        <div className="flex flex-col items-center mx-4">
          <span className="text-3xl font-bold text-blue-700">
            {score.home} - {score.away}
          </span>
        </div>
        <div className="flex flex-col items-center min-w-[90px]">
          <img
            src={awayTeam?.avatar}
            alt={awayTeam?.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
          />
          <div className="text-sm font-semibold mt-1">{awayTeam?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchInfo;
