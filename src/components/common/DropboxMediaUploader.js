import React, { useState } from "react";
import useDropbox from "@/hooks/userDropbox";

const DropboxMediaUploader = ({
  appKey,
  buttonText = "Chọn ảnh hoặc video từ Dropbox",
  className = "",
  onSelect,
}) => {
  const isDropboxReady = useDropbox(appKey);
  const [file, setFile] = useState(null);

  const handleChoose = () => {
    if (!isDropboxReady || !window.Dropbox) return;

    window.Dropbox.choose({
      linkType: "direct",
      multiselect: false,
      extensions: [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".webm"],
      success: ([selected]) => {
        const rawLink = selected.link.replace("?dl=0", "?raw=1");
        const isImage = selected.name.match(/\.(jpg|jpeg|png|webp)$/i);
        const isVideo = selected.name.match(/\.(mp4|mov|webm)$/i);

        const fileInfo = {
          url: rawLink,
          name: selected.name,
          type: isImage ? "image" : isVideo ? "video" : "unknown",
        };

        setFile(fileInfo);
        onSelect?.(fileInfo);
      },
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <button
        onClick={handleChoose}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {buttonText}
      </button>

      {file?.type === "image" && (
        <img
          src={file.url}
          alt="Dropbox preview"
          className="max-w-full rounded shadow"
        />
      )}

      {file?.type === "video" && (
        <video src={file.url} controls className="max-w-full rounded shadow" />
      )}
    </div>
  );
};

export default DropboxMediaUploader;
