import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setMatchDataStore,
  setMatchId,
  setMatchTeams,
  resetMatchState,
  setMatchEvents,
  clearEditingEvent,
} from "@/store/matchSlide";
import { resetVideoState } from "@/store/videoSlide";
import { updateStats } from "@/utils/updateStats";
import teamAPI from "@/api/teamAPI";
import matchAPI from "@/api/matchAPI";
import eventAPI from "@/api/eventAPI";
import VideoPlayerArea from "@/components/matchStudio/v2/VideoPlayerArea";
import TimelineTracker from "@/components/matchStudio/v2/TimelineTracker";
import EventCreator from "@/components/matchStudio/v2/EventCreator";
import EventLog from "@/components/matchStudio/v2/EventLog";
import MatchInfo from "@/components/matchStudio/v2/MatchInfo";
import MatchSetupDialog from "@/components/matchStudio/v2/MatchSetupDialog";
import EventToastNoti from "@/components/matchStudio/EventToastNoti";
import LoadingOverlay from "@/components/common/LoadingOverlay";

const MatchStudio = () => {
  const dispatch = useDispatch();
  const lastEventCreatedAt = useSelector(
    (state) => state.match.lastEventCreatedAt
  );

  const { matchId } = useParams();
  const [toast, setToast] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(!matchId);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    dispatch(setMatchId(matchId));
    const initMatchData = async () => {
      try {
        const matchData = await fetchMatchData(matchId);
        dispatch(setMatchDataStore(matchData));

        const { homeTeam, awayTeam } = await fetchTeamsData(matchData);
        dispatch(setMatchTeams({ homeTeam, awayTeam }));
      } catch (err) {
        console.error("Lỗi khởi tạo dữ liệu trận đấu:", err);
      } finally {
        setLoading(false);
      }
    };
    initMatchData();
    getEvents();
  }, []);

  useEffect(() => {
    if (lastEventCreatedAt.length === 0) return;
    reCalculate();
    getEvents();
  }, [lastEventCreatedAt]);

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

  const reCalculate = async () => {
    if (!matchId) return;
    setLoading(true);
    await updateStats();
    const data = await fetchMatchData(matchId);
    dispatch(setMatchDataStore(data));
    setLoading(false);
  };

  const getEvents = async () => {
    if (!matchId) return;
    try {
      const res = await eventAPI.getMatchEvents(matchId);
      dispatch(setMatchEvents(res));
    } catch (error) {
      console.log(error);
    }
  };

  const updateEvent = async (eventData, eventId = null) => {
    try {
      let res;
      if (eventId) {
        res = await eventAPI.editEvent(matchId, eventId, eventData);
        setToast("✔️ Event updated successfully!");
      } else {
        res = await eventAPI.createEvent(matchId, eventData);
        setToast("✔️ Event created successfully!");
      }
      reCalculate();
      dispatch(clearEditingEvent());
    } catch (err) {
      setToast("❌ Failed to save event.");
      console.error(err);
    }
  };

  // clearup
  useEffect(() => {
    return () => {
      dispatch(resetMatchState());
      dispatch(resetVideoState());
    };
  }, []);

  return (
    <>
      {toast && (
        <EventToastNoti message={toast} onClose={() => setToast(null)} />
      )}
      <LoadingOverlay show={loading} />
      <div className="bg-studiobg page-container overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-[12px] p-[14px] min-h-0">
          <div className="col-span-6 h-full flex flex-col min-h-0 overflow-hidden">
            <div className="h-2/3">
              <VideoPlayerArea onLoadingChange={setLoading} />
            </div>

            <div className="h-1/3">
              <TimelineTracker matchId={matchId} />
            </div>
          </div>
          <div className="col-span-6 h-full flex flex-col gap-[12px] min-h-0 overflow-hidden">
            <div className="h-1/3 overflow-y-auto">
              <div className="h-full flex items-center justify-between gap-[12px]">
                <MatchInfo />
                <EventLog />
              </div>
            </div>
            <div className="h-2/3">
              <EventCreator handleUpdateEvents={updateEvent} />
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
