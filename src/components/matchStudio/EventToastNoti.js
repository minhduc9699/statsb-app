import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ToastNotification = ({ message, onClose }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      toastRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    const timer = setTimeout(() => {
      gsap.to(toastRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.4,
        onComplete: onClose,
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={toastRef}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] bg-[#5cb85c] text-white px-6 py-3 rounded shadow-lg font-semibold text-center"
    >
      {message}
    </div>
  );
};

export default ToastNotification;
