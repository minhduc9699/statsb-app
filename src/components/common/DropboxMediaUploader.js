import React, { useState } from "react";

const DropboxMediaUploader = () => {
  const [file, setFile] = useState(null);

  const handleDropboxChoose = () => {
    if (!window.Dropbox) return;

    window.Dropbox.choose({
      linkType: "direct",
      multiselect: false,
      extensions: [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"],
      success: ([selected]) => {
        const rawLink = selected.link.replace("?dl=0", "?raw=1");
        const isImage = selected.name.match(/\.(jpg|jpeg|png|webp)$/i);
        const isVideo = selected.name.match(/\.(mp4|mov|webm)$/i);

        setFile({ url: rawLink, type: isImage ? "image" : isVideo ? "video" : "unknown" });
      },
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDropboxChoose}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload Ảnh hoặc Video từ Dropbox
      </button>

      {file?.type === "image" && (
        <img src={file.url} alt="Dropbox preview" className="max-w-full rounded shadow" />
      )}

      {file?.type === "video" && (
        <video
          src={file.url}
          controls
          className="max-w-full rounded shadow"
        />
      )}
    </div>
  );
};

export default DropboxMediaUploader;
