import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMatchDataStore, setMatchId, setMatchInfo, setGameType } from "@/store/matchSlide";
import { updateStats } from "@/utils/updateStats";
import teamAPI from "@/api/teamAPI";
import matchAPI from "@/api/matchAPI";
import VideoPlayerArea from "@/components/matchStudio/VideoPlayerArea";
import TimelineTracker from "@/components/matchStudio/TimelineTracker";
import EventCreator from "@/components/matchStudio/EventCreator";
import EventLog from "@/components/matchStudio/EventLog";
import MatchInfo from "@/components/matchStudio/MatchInfo";
import MatchSetupDialog from "@/components/matchStudio/MatchSetupDialog";
// import LoadingOverlay from "@/components/common/LoadingOverlay";

const MatchStudio = () => {
  const dispatch = useDispatch();

  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(!matchId);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  // const [teams, setTeams] = useState([]);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const matchEvents = useSelector((state) => state.match.matchEvents);

  const videoRef = useRef(null);

  useEffect(() => {
    if (!matchId) return;

    const initMatchData = async () => {
      try {
        const matchData = await fetchMatchData(matchId);
        const { homeTeam, awayTeam } = await fetchTeamsData(matchData);

        dispatch(setMatchDataStore(matchData));
        dispatch(setMatchId(matchId));
        dispatch(setGameType(matchData.gameType));
        dispatch(setMatchInfo({ homeTeam, awayTeam }));

        setMatchData(matchData);
        setHomeTeam(homeTeam);
        setAwayTeam(awayTeam);
        setHomePlayers(homeTeam.rosters || []);
        setAwayPlayers(awayTeam.rosters || []);
      } catch (err) {
        console.error("Lỗi khởi tạo dữ liệu trận đấu:", err);
      }
    };

    initMatchData();
  }, [matchId]);

  useEffect(() => {
    if (matchEvents) {
      reCaculate();
    }
  }, [matchEvents]);

  const reCaculate = async () => {
    if (!matchId) return;
    await updateStats();
    const data = await fetchMatchData(matchId);
    setMatchData(data);
    dispatch(setMatchDataStore(data));
  };

  const fetchMatchData = async (id) => {
    try {
      const res = await matchAPI.getMatchById(id);
      if (!res?.data) throw new Error("Không có dữ liệu match.");
      return res.data;
    } catch (error) {
      console.error("Lỗi khi fetch match:", error);
      throw error;
    }
  };

  const fetchTeamsData = async (matchData) => {
    const homeId = matchData?.homeTeam?._id;
    const awayId = matchData?.awayTeam?._id;

    if (!homeId || !awayId) {
      throw new Error("Thiếu thông tin team trong matchData");
    }

    try {
      const [homeRes, awayRes] = await Promise.all([
        teamAPI.getTeamById(homeId),
        teamAPI.getTeamById(awayId),
      ]);

      const homeData = homeRes?.data;
      const awayData = awayRes?.data;

      if (!homeData || !awayData) {
        throw new Error("Không lấy được dữ liệu team");
      }

      return { homeTeam: homeData, awayTeam: awayData };
    } catch (error) {
      console.error("Lỗi khi fetch team:", error);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-studiobg page-container overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-[12px] p-[14px] min-h-0">
          <div className="col-span-6 h-full flex flex-col min-h-0 overflow-hidden">
            <div className="h-2/3">
              <VideoPlayerArea matchData={matchData} />
            </div>

            <div className="h-1/3">
              <TimelineTracker matchId={matchId} />
            </div>
          </div>
          <div className="col-span-6 h-full flex flex-col gap-[12px] min-h-0 overflow-hidden">
            <div className="h-1/3 overflow-y-auto">
              <div className="h-full flex items-center justify-between gap-[12px]">
                <MatchInfo />
                <EventLog matchId={matchId} />
              </div>
            </div>
            <div className="h-2/3">
              <EventCreator />
            </div>
          </div>
        </div>
        {!matchId && (
          <MatchSetupDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default MatchStudio;
