import React, { useRef, useState, useEffect } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addVideo,
  setCurrentVideoIndex,
  moveVideo,
  renameVideo,
  deleteVideo,
  setCurrentTime,
  setIsPlaying,
  setDuration,
  setSeekingTime,
} from "@/store/videoSlide";

import matchAPI from "@/api/matchAPI";
import fiveBackward from "@/assets/video-player/5-seconds-backward.png";
import tenBackward from "@/assets/video-player/10-seconds-backward.png";
import fiveForward from "@/assets/video-player/5-seconds-forward.png";
import tenForward from "@/assets/video-player/10-seconds-forward.png";
import play from "@/assets/video-player/play.png";
import pause from "@/assets/video-player/pause.png";

const VideoPlayerArea = () => {
  const matchData = useSelector((state) => state.match.matchDataStore);
  const videos = useSelector((state) => state.video.videos);
  const currentVideoIndex = useSelector(
    (state) => state.video.currentVideoIndex
  );
  const currentTime = useSelector((state) => state.video.currentTime);
  const duration = useSelector((state) => state.video.duration);
  const isPlaying = useSelector((state) => state.video.isPlaying);
  const seekingTime = useSelector((state) => state.video.seekingTime);

  const containerRef = useRef(null);
  const uploaderRef = useRef();
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [renamingIndex, setRenamingIndex] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotateDeg, setRotateDeg] = useState(0);
  const videoRef = useRef(null);
  const addedUrlsRef = useRef(new Set());
  const videoSrc = videos[currentVideoIndex]?.src;

  const dispatch = useDispatch();

  useEffect(() => {
    if (matchData && Array.isArray(matchData.videoUrl)) {
      matchData.videoUrl.forEach((video) => {
        if (!addedUrlsRef.current.has(video.url)) {
          dispatch(addVideo({ src: video.url, name: `Video ${video._id}` }));
          addedUrlsRef.current.add(video.url); // Đánh dấu là đã add
        }
      });
    }
  }, [matchData, dispatch]);

  useEffect(() => {
    handleSeek();
  }, [seekingTime]);

  const handleAfterUpload = async (fileInfo) => {
    if (!fileInfo || fileInfo.allEntries.length === 0) {
      return;
    } else {
      const url = fileInfo.allEntries[0].cdnUrl;
      if (url === null) return;
      dispatch(addVideo({ src: url, name: "hiep1" }));
      await updateMatch(fileInfo.allEntries[0].cdnUrl);
    }
  };

  const updateMatch = async (src) => {
    try {
      const response = await matchAPI.updateMatch(matchData._id, {
        ...matchData,
        videoUrl: [{ url: src }],
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handleMoveVideo = (fromIdx, toIdx) => {
    dispatch(moveVideo({ fromIdx, toIdx }));
  };

  const handleRename = (i) => {
    setRenamingIndex(i);
    setRenameText(videos[i].name);
  };

  const applyRename = () => {
    dispatch(renameVideo({ id: renamingIndex, name: renameText }));
    setRenamingIndex(null);
  };

  const handleDeleteVideo = (index) => {
    dispatch(deleteVideo(index));
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          dispatch(setIsPlaying(true));
        })
        .catch((err) => {
          console.warn("Lỗi khi phát video:", err);
        });
    } else {
      video.pause();
      dispatch(setIsPlaying(false));
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      dispatch(setIsPlaying(false));
    }
  }, [videoSrc]);

  const changeSpeed = (rate) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime += seconds;
  };

  const handleUpdateTime = () => {
    const video = videoRef.current;
    if (!video) return;
    dispatch(setCurrentTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    dispatch(setDuration(videoRef.current.duration));
  };

  const handleSeek = (input) => {
    const video = videoRef.current;
    let seekTime = null;

    if (input && input.target) {
      seekTime = parseFloat(input.target.value);
    } else if (!input) {
      seekTime = parseFloat(seekingTime);
    } else {
      return;
    }

    if (video && !isNaN(seekTime)) {
      video.currentTime = seekTime;
      dispatch(setCurrentTime(seekTime));
      video.pause();
      dispatch(setIsPlaying(false));
    }
    dispatch(setSeekingTime(null));
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    let percentX = 0;
    let percentY = 0;

    switch (rotateDeg % 360) {
      case 0:
        percentX = (-dx / rect.width) * 100;
        percentY = (-dy / rect.height) * 100;
        break;
      case 90:
        percentX = (-dy / rect.height) * 100;
        percentY = (-dx / rect.width) * 100;
        break;
      case 180:
        percentX = (dx / rect.width) * 100;
        percentY = (dy / rect.height) * 100;
        break;
      case 270:
        percentX = (dy / rect.height) * 100;
        percentY = (dx / rect.width) * 100;
        break;
      default:
        break;
    }

    const newX = Math.max(0, Math.min(100, zoomPosition.x + percentX));
    const newY = Math.max(0, Math.min(100, zoomPosition.y + percentY));

    setZoomPosition({ x: newX, y: newY });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotateDeg((prev) => (prev + 90) % 360);
  };

  useEffect(() => {
    let hideControlsTimeout;
    const container = containerRef.current;

    const show = () => {
      setShowControls(true);
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => setShowControls(false), 2500);
    };

    container?.addEventListener("mousemove", show);
    container?.addEventListener("mouseleave", () => setShowControls(false));

    show();

    return () => {
      container?.removeEventListener("mousemove", show);
      container?.removeEventListener("mouseleave", () =>
        setShowControls(false)
      );
      clearTimeout(hideControlsTimeout);
    };
  }, [videos]);

  return (
    <div ref={containerRef} className="relative h-full overflow-hidden">
      {/* Playlist (top left) */}
      {/* {videos.length > 0 && (
        <div className="absolute top-2 left-2 bg-gray-900/80 p-2 rounded text-sm z-10">
          <label className="block mb-1 text-gray-300 font-semibold">
          </label>
          <FileUploaderRegular
            pubkey="dbddae4f64d1ab0ca344"
            multiple={false}
            accept="video/*"
            onChange={(fileInfo) => {
              console.log("Uploaded:", fileInfo.allEntries[0].cdnUrl);
            }}
            locale="en"
            tabs="file url camera"
            className="video-uploader"
          />
          <ul>
            {videos.map((video, i) => (
              <li
                key={i}
                className={`flex items-center text-white justify-between px-2 py-1 mb-1 rounded cursor-pointer ${
                  i === currentVideoIndex
                    ? "bg-gray-700"
                    : "bg-dark hover:bg-gray-600"
                }`}
                onClick={() => dispatch(setCurrentVideoIndex(i))}
              >
                {renamingIndex === i ? (
                  <input
                    type="text"
                    value={renameText}
                    onChange={(e) => setRenameText(e.target.value)}
                    onBlur={applyRename}
                    onKeyDown={(e) => e.key === "Enter" && applyRename()}
                    className="text-black text-xs px-1 py-0.5 rounded"
                    autoFocus
                  />
                ) : (
                  <span
                    className="truncate max-w-[100px]"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleRename(i);
                    }}
                  >
                    {video.name}
                  </span>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveVideo(i, i - 1);
                    }}
                    className="text-xs"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveVideo(i, i + 1);
                    }}
                    className="text-xs"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVideo(i);
                    }}
                    className="text-xs text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {/* Zoom (top right) */}
      {videos.length > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-gray-900/80 bg-opacity-70 px-2 py-1 rounded shadow flex flex-col items-center">
          <input
            type="range"
            min="1"
            max="3"
            step="0.25"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
          <span className="text-white text-bold text-[20px]">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleRotate}
            className="mt-2 bg-dark text-white px-2 py-1 rounded hover:bg-gray-700"
          >
            🔄 ({rotateDeg}°)
          </button>
        </div>
      )}

      {/* Upload if empty */}
      {videos.length === 0 && (
        <FileUploaderRegular
          pubkey="dbddae4f64d1ab0ca344"
          multiple={false}
          onChange={handleAfterUpload}
          locale="en"
          tabs="file url camera"
          className="flex items-center justify-center w-full h-full"
        />
      )}

      {/* Video Player */}
      {videoSrc && (
        <div className="relative h-full">
          <video
            ref={videoRef}
            src={videoSrc}
            onTimeUpdate={handleUpdateTime}
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute object-contain w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotate(${rotateDeg}deg) scale(${scale})`,
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transition: isDragging ? "none" : "transform 0.2s ease",
              cursor:
                scale > 1 ? (isDragging ? "grabbing" : "grab") : "pointer",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
            }}
            controls={false}
          />

          {/* Overlay Controls */}
          {showControls && (
            <div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-[28px] px-[56px] py-[16px] bg-[#2D2D2DE5] transition-opacity rounded-[28px]">
                <div
                  onClick={() => skip(-10)}
                  className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
                >
                  <img
                    src={tenBackward}
                    alt="10 seconds backward"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div
                  onClick={() => skip(-5)}
                  className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
                >
                  <img
                    src={fiveBackward}
                    alt="5 seconds backward"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div
                  onClick={togglePlay}
                  className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
                >
                  <img src={isPlaying ? pause : play} alt="play" />
                </div>
                <div
                  onClick={() => skip(5)}
                  className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
                >
                  <img
                    src={fiveForward}
                    alt="5 seconds forward"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div
                  onClick={() => skip(10)}
                  className="w-[28px] h-[28px] cursor-pointer hover:scale-110"
                >
                  <img
                    src={tenForward}
                    alt="10 seconds forward"
                    className="w-full h-full"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <select
                  value={playbackRate}
                  onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                  className="ml-auto bg-transparent text-white px-2 py-1 rounded hover:scale-110"
                >
                  <option className="text-dark" value={0.5}>
                    0.5x
                  </option>
                  <option className="text-dark" value={1}>
                    1x
                  </option>
                  <option className="text-dark" value={1.5}>
                    1.5x
                  </option>
                  <option className="text-dark" value={2}>
                    2x
                  </option>
                </select>
              </div>
              <div className="absolute bottom-0 left-0 w-full px-2 z-10">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full appearance-none bg-transparent h-[6px] hover:h-[10px] transition-all duration-200 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[#1EB8FF]
                    [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-white
                    bg-white/30 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Time Display */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-300">
            {new Date(currentTime * 1000).toISOString().substr(14, 5)} /{" "}
            {new Date(duration * 1000).toISOString().substr(14, 5)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerArea;
