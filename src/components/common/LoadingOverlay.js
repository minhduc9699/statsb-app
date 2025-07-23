import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import basketballIcon from "../../assets/basketball-ball.png";

const LoadingOverlay = ({ show = false }) => {
  const overlayRef = useRef(null);
  const ballRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (show) {
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });

      gsap.to(ballRef.current, {
        rotation: "+=360",
        duration: 1,
        repeat: -1,
        ease: "linear",
      });

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      );
    } else {
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
      gsap.killTweensOf(ballRef.current);
    }
  }, [show]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black from-orange-50 to-orange-200 bg-opacity-90 flex flex-col items-center justify-center z-[9999] opacity-0 pointer-events-none"
    >
      <img
        ref={ballRef}
        src={basketballIcon}
        alt="Loading basketball"
        className="w-16 h-16 mb-4 animate-pulse"
      />
      <p ref={textRef} className="text-white font-semibold text-lg tracking-wide">
        Đang tải dữ liệu trận đấu...
      </p>
    </div>
  );
};

export default LoadingOverlay;
