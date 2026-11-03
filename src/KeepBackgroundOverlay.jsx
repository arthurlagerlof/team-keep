import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function KeepBackgroundOverlay({ onComplete }) {
  const root = useRef(null);
  const leftPanel = useRef(null);
  const rightPanel = useRef(null);

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });

      // Upper-left half moves left.
      tl.to(
        leftPanel.current,
        {
          xPercent: -110,
          duration: 0.86,
          ease: "power3.inOut",
        },
        0
      );

      // Lower-right half moves right.
      tl.to(
        rightPanel.current,
        {
          xPercent: 110,
          duration: 0.86,
          ease: "power3.inOut",
        },
        0
      );
    }, root);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "auto",
        zIndex: 10000,
      }}
    >
      {/* Upper-left background panel */}
      <div
        ref={leftPanel}
        style={{
          position: "absolute",
          inset: 0,
          background: "#0B3041",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          willChange: "transform",
        }}
      />

      {/* Lower-right background panel */}
      <div
        ref={rightPanel}
        style={{
          position: "absolute",
          inset: 0,
          background: "#0B3041",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}