export const formatTime = (s) => {
  const time = Number(s);
  if (!Number.isFinite(time)) return "00:00";

  const totalSeconds = Math.round(time);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return [mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
};