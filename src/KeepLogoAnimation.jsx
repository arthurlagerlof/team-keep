import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function KeepLogoAnimation({ onAnimationComplete }) {
  const logoRef = useRef(null);

  useLayoutEffect(() => {
    let onPointerMove;
    let onPointerLeave;
    let interactionArea;
    let interactionTargets = [];
    let ambientTimer;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(logoRef);

      // ------------------------------------------
      // ELEMENT REFERENCES
      // ------------------------------------------

      // First E: long horizontal bars
      const topLeft = q("#path-ebar3");
      const bottomLeft = q("#path-ebar1");

      // Second E: individual horizontal bars
      const topRight = q("#path-ebar4");
      const bottomRight = q("#path-ebar5");

      // First E middle bar
      const middleLeft = q("#path-ebar2");

      // First E vertical stem only
      const eStem = q("#path-e1");

      // Second E arrow
      const arrow = q("#path-arrow");

      // Complete K and P groups
      const kGroup = q("#k-group");
      const pGroup = q("#p-group");

      // Dark components for impact overlap
      const kDark = q("#path-k2");
      const pDark = q("#path-p");

      // ------------------------------------------
      // INITIAL STATE
      // ------------------------------------------

      /*
       * TWO VERY LONG E BARS
       *
       * The first E's top and bottom bars are
       * stretched across both E positions.
       *
       * 4.6x gives them a deliberately exaggerated
       * width during the opening reveal.
       */

      gsap.set([topLeft, bottomLeft], {
        scaleX: 4.6,
        autoAlpha: 1,
        transformOrigin: "left center",
      });

      /*
       * The second E's top and bottom bars are
       * hidden until E formation.
       */

      gsap.set([topRight, bottomRight], {
        scaleX: 0,
        autoAlpha: 0,
        transformOrigin: "left center",
      });

      // First E middle bar appears during formation.
      gsap.set(middleLeft, {
        scaleX: 0,
        autoAlpha: 0,
        transformOrigin: "left center",
      });

      /*
       * First E stem is very short and hidden.
       *
       * It will grow into its original full height.
       */

      gsap.set(eStem, {
        scaleY: 0.015,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
      });

      /*
       * Arrow starts completely outside the
       * left side of the logo.
       */

      gsap.set(arrow, {
        x: -600,
        scaleX: 0.65,
        autoAlpha: 0,
        transformOrigin: "left center",
      });

      /*
       * K enters as a complete group.
       */

      gsap.set(kGroup, {
        x: -340,
        y: 0,
        scaleX: 0.92,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
      });

      /*
       * P enters as a complete group too.
       *
       * Its light stem and dark body remain
       * separate children for the impact effect.
       */

      gsap.set(pGroup, {
        x: 340,
        y: 0,
        scaleX: 0.92,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set([kDark, pDark], {
        x: 0,
      });

      // ------------------------------------------
      // MASTER TIMELINE
      // ------------------------------------------

      const letterOuters = ["#letter-k", "#letter-e1", "#letter-e2", "#letter-p"].map(
        (selector) => q(selector)[0]
      );
      const letterInners = letterOuters.map((outer) => outer.querySelector(".letter-inner"));
      interactionTargets = [...letterOuters, ...letterInners];
      gsap.set(letterInners, {
        "--shadow-x": "0px",
        "--shadow-y": "7px",
        "--shadow-blur": "8px",
        "--shadow-opacity": 0.2,
      });
      gsap.set(logoRef.current, { perspective: 650 });
      gsap.set(letterOuters, { transformStyle: "preserve-3d", transformOrigin: "50% 50%" });

      const letterAnimations = letterOuters.map((outer, index) => ({
        outer,
        rotateX: gsap.quickTo(outer, "rotationX", { duration: 0.6, ease: "power3.out" }),
        rotateY: gsap.quickTo(outer, "rotationY", { duration: 0.6, ease: "power3.out" }),
        moveX: gsap.quickTo(letterInners[index], "x", { duration: 0.6, ease: "power3.out" }),
        moveY: gsap.quickTo(letterInners[index], "y", { duration: 0.6, ease: "power3.out" }),
        shadowX: gsap.quickTo(letterInners[index], "--shadow-x", {
          duration: 0.6,
          ease: "power3.out",
          unit: "px",
        }),
        shadowY: gsap.quickTo(letterInners[index], "--shadow-y", {
          duration: 0.6,
          ease: "power3.out",
          unit: "px",
        }),
        shadowBlur: gsap.quickTo(letterInners[index], "--shadow-blur", {
          duration: 0.6,
          ease: "power3.out",
          unit: "px",
        }),
        shadowOpacity: gsap.quickTo(letterInners[index], "--shadow-opacity", {
          duration: 0.6,
          ease: "power3.out",
        }),
      }));
      const maxTilt = 15;
      let animationComplete = false;
      let pointerActive = false;
      let lastPointerPosition = null;
      interactionArea = logoRef.current.closest(".intro-section") || logoRef.current;

      const applyCursorPosition = (clientX, clientY) => {
        letterAnimations.forEach(({ outer, rotateX, rotateY, moveX, moveY, shadowX, shadowY, shadowBlur, shadowOpacity }) => {
          const bounds = outer.getBoundingClientRect();
          const centerX = bounds.left + bounds.width / 2;
          const centerY = bounds.top + bounds.height / 2;
          const dx = clientX - centerX;
          const dy = clientY - centerY;
          const cursorX = gsap.utils.clamp(0, 1, (clientX - bounds.left) / bounds.width);
          const cursorY = gsap.utils.clamp(0, 1, (clientY - bounds.top) / bounds.height);
          const distance = Math.hypot(dx, dy);
          const strength = gsap.utils.clamp(0, 1, distance / Math.hypot(window.innerWidth / 2, window.innerHeight / 2));

          rotateX(gsap.utils.interpolate(maxTilt, -maxTilt, cursorY));
          rotateY(gsap.utils.interpolate(-maxTilt, maxTilt, cursorX));
          moveX(gsap.utils.clamp(-2, 2, dx / Math.max(bounds.width, 1) * 2));
          moveY(gsap.utils.clamp(-2, 2, dy / Math.max(bounds.height, 1) * 2));
          shadowX(distance ? (-dx / distance) * strength * 18 : 0);
          shadowY(distance ? (-dy / distance) * strength * 18 : 0);
          shadowBlur(8 + strength * 5);
          shadowOpacity(0.18 + strength * 0.12);
        });
      };
      const stopAmbient = () => {
        ambientTimer?.kill();
        ambientTimer = null;
      };
      const startAmbient = () => {
        if (!animationComplete || pointerActive) return;
        const bounds = interactionArea.getBoundingClientRect();
        applyCursorPosition(
          bounds.left + Math.random() * bounds.width,
          bounds.top + Math.random() * bounds.height
        );
        ambientTimer = gsap.delayedCall(2, startAmbient);
      };

      onPointerMove = (event) => {
        if (event.pointerType === "touch") return;
        lastPointerPosition = { x: event.clientX, y: event.clientY };
        pointerActive = true;
        stopAmbient();
        if (animationComplete) applyCursorPosition(event.clientX, event.clientY);
      };
      onPointerLeave = (event) => {
        if (event.pointerType === "touch") return;
        pointerActive = false;
        if (animationComplete) startAmbient();
      };

      interactionArea.addEventListener("pointermove", onPointerMove);
      interactionArea.addEventListener("pointerleave", onPointerLeave);
      const tl = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },
        onComplete: () => {
          animationComplete = true;
          onAnimationComplete?.();
          if (pointerActive && lastPointerPosition) {
            applyCursorPosition(lastPointerPosition.x, lastPointerPosition.y);
          } else {
            startAmbient();
          }
        },
      });

      // ==========================================
      // 01 — BACKGROUND REVEAL
      // 0.00–0.86s
      //
      // Handled independently by
      // KeepBackgroundOverlay.jsx.
      //
      // Only the two stretched E bars are visible.
      // ==========================================


      // ==========================================
      // 02 — ARROW LAUNCH
      // 0.90–1.33s
      // ==========================================

      // Reveal arrow just before launch.
      tl.set(
        arrow,
        {
          autoAlpha: 1,
        },
        0.90
      );

      // Rapid acceleration and horizontal elongation.
      tl.to(
        arrow,
        {
          x: 0,
          scaleX: 2.3,
          duration: 0.24,
          ease: "power4.in",
        },
        0.91
      );

      // Snap back into the exact original dimensions.
      tl.to(
        arrow,
        {
          scaleX: 1,
          duration: 0.18,
          ease: "elastic.out(1, 0.45)",
        },
        1.15
      );


      // ==========================================
      // 03 — E FORMATION
      // 1.38–1.82s
      // ==========================================

      /*
       * The two long bars contract to the original
       * dimensions of the first E's top and bottom.
       */

      tl.to(
        [topLeft, bottomLeft],
        {
          scaleX: 1,
          duration: 0.42,
          ease: "power3.out",
        },
        1.38
      );

      /*
       * Meanwhile, the second E's top and bottom
       * bars appear at their own original lengths.
       *
       * This creates the visual effect of the two
       * long bars separating into four individual bars.
       */

      tl.to(
        [topRight, bottomRight],
        {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.4,
          ease: "power3.out",
        },
        1.38
      );

      /*
       * First E middle bar appears at the same time
       * as the vertical E stem.
       */

      tl.to(
        middleLeft,
        {
          scaleX: 1,
          autoAlpha: 1,
          duration: 0.36,
          ease: "back.out(1.2)",
        },
        1.38
      );

      /*
       * ONLY the first E stem appears here.
       *
       * path-e2 belongs to the P group and stays
       * hidden until the P enters.
       */

      tl.to(
        eStem,
        {
          scaleY: 1,
          autoAlpha: 1,
          duration: 0.44,
          ease: "power3.out",
        },
        1.38
      );


      // ==========================================
      // 04 — K ENTRANCE AND IMPACT
      // 1.88–2.80s
      // ==========================================

      // K flies in from the left.
      tl.to(
        kGroup,
        {
          x: 0,
          scaleX: 1.04,
          autoAlpha: 1,
          duration: 0.62,
          ease: "power3.out",
        },
        1.88
      );

      // Small upward impact bounce.
      tl.to(
        kGroup,
        {
          y: -12,
          duration: 0.10,
          ease: "power2.out",
        },
        2.50
      );

      tl.to(
        kGroup,
        {
          y: 0,
          duration: 0.22,
          ease: "bounce.out",
        },
        2.60
      );

      // Compress slightly, then restore final width.
      tl.to(
        kGroup,
        {
          scaleX: 0.97,
          duration: 0.08,
          ease: "power2.in",
        },
        2.50
      );

      tl.to(
        kGroup,
        {
          scaleX: 1,
          duration: 0.16,
          ease: "power2.out",
        },
        2.58
      );

      /*
       * Move K's dark diagonal component slightly
       * into its light stem during impact.
       *
       * The blue stem is rendered above it.
       */

      tl.to(
        kDark,
        {
          x: -6,
          duration: 0.08,
          ease: "power2.in",
        },
        2.50
      );

      tl.to(
        kDark,
        {
          x: 0,
          duration: 0.16,
          ease: "power2.out",
        },
        2.58
      );


      // ==========================================
      // 05 — P ENTRANCE AND IMPACT
      // 1.98–2.80s
      // ==========================================

      /*
       * P enters as one complete letter.
       *
       * Both path-e2 and path-p are children of
       * p-group, so neither appears during E formation.
       */

      tl.to(
        pGroup,
        {
          x: 0,
          scaleX: 1.04,
          autoAlpha: 1,
          duration: 0.62,
          ease: "power3.out",
        },
        1.98
      );

      // P's upward impact bounce.
      tl.to(
        pGroup,
        {
          y: -12,
          duration: 0.10,
          ease: "power2.out",
        },
        2.60
      );

      tl.to(
        pGroup,
        {
          y: 0,
          duration: 0.18,
          ease: "bounce.out",
        },
        2.70
      );

      // Slight horizontal compression.
      tl.to(
        pGroup,
        {
          scaleX: 0.97,
          duration: 0.08,
          ease: "power2.in",
        },
        2.60
      );

      tl.to(
        pGroup,
        {
          scaleX: 1,
          duration: 0.12,
          ease: "power2.out",
        },
        2.68
      );

      // Move dark P body into its light stem.
      tl.to(
        pDark,
        {
          x: -6,
          duration: 0.08,
          ease: "power2.in",
        },
        2.60
      );

      tl.to(
        pDark,
        {
          x: 0,
          duration: 0.12,
          ease: "power2.out",
        },
        2.68
      );


      // ==========================================
      // 06 — FINAL NORMALIZATION
      // 2.80s
      // ==========================================

      // Guarantee exact original transforms.

      tl.set(
        [topLeft, bottomLeft, topRight, bottomRight],
        { scaleX: 1, autoAlpha: 1 },
        2.80
      );

      tl.set(
        [middleLeft, eStem],
        { scaleX: 1, scaleY: 1, autoAlpha: 1 },
        2.80
      );

      tl.set(
        arrow,
        { x: 0, scaleX: 1, autoAlpha: 1 },
        2.80
      );

      tl.set(
        [kGroup, pGroup],
        { x: 0, y: 0, scaleX: 1, autoAlpha: 1 },
        2.80
      );

      tl.set(
        [kDark, pDark],
        { x: 0 },
        2.80
      );

    }, logoRef);

    return () => {
      interactionArea?.removeEventListener("pointermove", onPointerMove);
      interactionArea?.removeEventListener("pointerleave", onPointerLeave);
      ambientTimer?.kill();
      gsap.killTweensOf(interactionTargets);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={logoRef}
      className="keep-logo"
      role="img"
      aria-label="KEEP logo"
      style={{ width: "100%", maxWidth: "681px" }}
    >
      <div className="letter-outer" id="letter-k" style={{ left: "0%", width: `${(225 / 681) * 100}%` }}>
        <div className="letter-inner">
          <svg viewBox="0 0 225 223" aria-hidden="true">
            <g id="k-group">
              <path id="path-k2" d="M125 221.5L83 165.5L90 76L147 0.5H219L133 107L225 221.5H125Z" fill="#0B3041" />
              <path id="path-k1" d="M96 0.5L78.5 221.5H0L17 0.5H96Z" fill="#156082" />
            </g>
          </svg>
        </div>
      </div>

      <div className="letter-outer" id="letter-e1" style={{ left: `${(206 / 681) * 100}%`, width: `${(144 / 681) * 100}%` }}>
        <div className="letter-inner">
          <svg viewBox="206 0 144 223" aria-hidden="true">
            <g id="e1-bars">
              <path id="path-ebar3" d="M347 48.5H289.5L293.105 0.5H350L347 48.5Z" fill="#0B3041" />
              <path id="path-ebar1" d="M333 221.5H276.5L280.5 174.5H337L333 221.5Z" fill="#0B3041" />
            </g>
            <path id="path-ebar2" d="M340 134.5H283L286.5 86.5H344L340 134.5Z" fill="#0B3041" />
            <path id="path-e1" d="M282.5 221.5H206L223 0.5H299L282.5 221.5Z" fill="#156082" />
          </svg>
        </div>
      </div>

      <div className="letter-outer" id="letter-e2" style={{ left: `${(353 / 681) * 100}%`, width: `${(147 / 681) * 100}%` }}>
        <div className="letter-inner">
          <svg viewBox="353 0 147 223" aria-hidden="true">
            <g id="e2-bars">
              <path id="path-ebar4" d="M368.5 0.5L365 48.5H497L500 0.5H368.5Z" fill="#0B3041" />
              <path id="path-ebar5" d="M356.5 174.5L353 222.5H485L488 174.5H356.5Z" fill="#0B3041" />
            </g>
            <path id="path-arrow" d="M359 134.5L362 86.5H430V64.5L494.5 111.5L430 158.5V134L359 134.5Z" fill="#156082" />
          </svg>
        </div>
      </div>

      <div className="letter-outer" id="letter-p" style={{ left: `${(492 / 681) * 100}%`, width: `${(189 / 681) * 100}%` }}>
        <div className="letter-inner">
          <svg viewBox="492 0 189 223" aria-hidden="true">
            <g id="p-group">
              <path
                id="path-p"
                d="M611 0.5H586L582.5 46.5H596 L601.5 47.5L605 48.5L609.5 50.5 L612.5 52L617.5 58L618.5 60 L619.5 62.5L620.5 66L621.5 71 V77L620.5 83.5L619.5 87.5 L617.5 91.5L614.5 95.5L606.5 100.5 L598.5 102.5H578L575 148.5H605.5 L616.5 148L624 147.5L629 146.5 L633 145.5L637.5 144L642.5 142 L647.5 139.5L654.5 135L664.5 125.5 L671.5 115.5L674.5 108.5L676.5 103 L678.5 95L680 89L681 77.5V71 L680 62.5L679 57L677 49L676 45 L674 40L670 33L666.5 27.5 L657 17.5L652 14L650.5 13L649 12 L647.5 11L645.5 10L643.5 9 L641.5 8L639 6.5L637 5.5 L634 4.5L630 3.5L626 2.5 L620 1.5L611 0.5Z"
                fill="#0B3041"
              />
              <path id="path-e2" d="M492 221.5L509 0.5H586L570 221.5H492Z" fill="#156082" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}