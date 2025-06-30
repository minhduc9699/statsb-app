export const formatTime = (s) => {
  if (!Number.isFinite(s)) return "00:00";
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = Math.floor(s % 60);
  return hrs
    ? [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":")
    : [mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
};