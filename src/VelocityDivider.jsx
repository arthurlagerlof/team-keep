import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MAX_DEFORMATION = 120;
const VELOCITY_MULTIPLIER = 0.035;
const MIN_VELOCITY = 8;
const IDLE_DELAY = 0.12;
const RESPONSE_DURATION = 0.25;
const RECOVERY_DURATION = 0.85;

export default function VelocityDivider() {
  const teamRef = useRef(null);
  const whitePathRef = useRef(null);
  const bluePathRef = useRef(null);
  const svgRef = useRef(null);
  const widthRef = useRef(100);
  const bendRef = useRef({ value: 0 });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const whitePath = whitePathRef.current;
    const bluePath = bluePathRef.current;
    const team = teamRef.current.parentElement;
    const bend = bendRef.current;
    let idleReset;
    let recoveryTween;

    const renderPath = () => {
      const width = widthRef.current;
      const curve = `M 0 0 Q ${width / 2} ${bend.value} ${width} 0`;
      whitePath.setAttribute("d", `${curve} L ${width} -140 L 0 -140 Z`);
      bluePath.setAttribute("d", `${curve} L ${width} 140 L 0 140 Z`);
    };

    const setBend = gsap.quickTo(bend, "value", {
      duration: RESPONSE_DURATION,
      ease: "power3.out",
      onUpdate: renderPath,
    });

    const resize = () => {
      widthRef.current = window.innerWidth;
      svgRef.current.setAttribute("viewBox", `0 -140 ${widthRef.current} 280`);
      renderPath();
    };

    const trigger = ScrollTrigger.create({
      trigger: team,
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        if (Math.abs(velocity) >= MIN_VELOCITY) {
          recoveryTween?.kill();
          setBend(
            gsap.utils.clamp(
              -MAX_DEFORMATION,
              MAX_DEFORMATION,
              -velocity * VELOCITY_MULTIPLIER,
            ),
          );
        }
        idleReset?.kill();
        idleReset = gsap.delayedCall(IDLE_DELAY, () => {
          recoveryTween = gsap.to(bend, {
            value: 0,
            duration: RECOVERY_DURATION,
            ease: "power3.out",
            onUpdate: renderPath,
          });
        });
      },
    });

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      idleReset?.kill();
      recoveryTween?.kill();
      gsap.killTweensOf(bend);
      trigger.kill();
    };
  }, []);

  return (
    <div className="team-transition" ref={teamRef} aria-hidden="true">
      <svg
        ref={svgRef}
        className="team-transition-divider"
        viewBox="0 -140 100 140"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path ref={bluePathRef} fill="#156082" />
        <path ref={whitePathRef} fill="#fff" />
      </svg>
    </div>
  );
}
