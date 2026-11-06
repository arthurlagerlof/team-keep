import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProjectTeamDivider() {
  const dividerRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const project = dividerRef.current.closest(".project-section");
    const animation = gsap.fromTo(
      dividerRef.current,
      { width: "20vw" },
      {
        width: "100vw",
        ease: "none",
        scrollTrigger: {
          trigger: project,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return <div className="project-team-divider" ref={dividerRef} aria-hidden="true" />;
}
