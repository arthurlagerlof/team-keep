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
  const canvasRef = useRef(null);
  const bendRef = useRef({ value: 0 });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const team = teamRef.current.closest(".team-section");
    const bend = bendRef.current;
    let idleReset;
    let recoveryTween;

    const renderCanvas = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const scale = window.devicePixelRatio || 1;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#156082";
      context.beginPath();
      context.moveTo(0, height / 2);
      context.quadraticCurveTo(width / 2, height / 2 + bend.value, width, height / 2);
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();
      context.fill();
    };

    const setBend = gsap.quickTo(bend, "value", {
      duration: RESPONSE_DURATION,
      ease: "power3.out",
      onUpdate: renderCanvas,
    });

    const resize = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * scale);
      canvas.height = Math.round(canvas.clientHeight * scale);
      renderCanvas();
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
            onUpdate: renderCanvas,
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
      <canvas className="team-transition-divider" ref={canvasRef} />
    </div>
  );
}
