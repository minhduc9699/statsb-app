// hooks/useDropbox.js
import { useEffect, useState } from "react";

const useDropbox = (appKey) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Dropbox) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.id = "dropboxjs";
    script.type = "text/javascript";
    script.setAttribute("data-app-key", appKey);

    script.onload = () => setReady(true);
    script.onerror = () => console.error("Failed to load Dropbox SDK");

    document.body.appendChild(script);
  }, [appKey]);

  return ready;
};

export default useDropbox;
