import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import KeepBackgroundOverlay from "./KeepBackgroundOverlay";
import KeepLogoAnimation from "./KeepLogoAnimation";

export default function KeepHero() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [ctaReady, setCtaReady] = useState(false);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const timeline = gsap.timeline({ paused: true });
    gsap.set(button, { boxShadow: "0px 0px 0px rgba(11, 48, 65, 0)" });
    const fall = { time: 0 };
    const fallDuration = 0.2;
    const startScale = 1.12;
    timeline
      .to(button, { scale: startScale, duration: 0.08, ease: "power2.out" })
      .to(fall, {
        time: fallDuration,
        duration: fallDuration,
        ease: "none",
        onUpdate: () => {
          const fallProgress = fall.time / fallDuration;
          gsap.set(button, { scale: startScale - 0.22 * fallProgress ** 2 });
        },
      })
      .to(button, {
        boxShadow: "0px 14px 28px rgba(11, 48, 65, 0.24)",
        duration: 0.12,
        ease: "power2.out",
      });
    const onEnter = () => timeline.restart();
    const onLeave = () => timeline.reverse();
    button.addEventListener("pointerenter", onEnter);
    button.addEventListener("pointerleave", onLeave);
    button.addEventListener("focus", onEnter);
    button.addEventListener("blur", onLeave);
    return () => {
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("focus", onEnter);
      button.removeEventListener("blur", onLeave);
      timeline.kill();
    };
  }, []);

  return (
    <div className="keep-hero-animation">
      <div className="keep-hero-content">
        <KeepLogoAnimation
          onAnimationComplete={() => setCtaReady(true)}
        />
        <div className="keep-cta-wrap">
          <a ref={buttonRef} className={`keep-cta${ctaReady ? " is-visible" : ""}`} href="#team">Meet the team</a>
        </div>
      </div>
      {showOverlay && <KeepBackgroundOverlay onComplete={() => setShowOverlay(false)} />}
    </div>
  );
}