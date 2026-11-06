import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import KeepHero from "./KeepHero.jsx";
import VelocityDivider from "./VelocityDivider.jsx";

const members = [
  {
    name: "Özge Şahin",
    image: "/images/ozge_sahin.jpeg",
    description:
      "I am a Software Engineering student at LUT University interested in utilising AI tools to improve solutions in creative and intuitive ways. I’m excited to explore ideas and learn together!",
    linkedin: "https://www.linkedin.com/in/ozgesahin05/",
    phone: "+90 541 710 84 17",
    email: "Ozge.Sahin@student.lut.fi",
  },
  {
    name: "Arthur Lagerlöf",
    image: "/images/arthur_lagerlof.jpeg",
    description:
      "Founder of ZoneTask (zonetask.app) | Web Application Developer | Based in Turku, Finland",
    linkedin: "https://www.linkedin.com/in/arthur-lagerl%C3%B6f-85031927b/",
    phone: "+358406347109",
    email: "arthur.lagerlof@abo.fi",
  },
  {
    name: "Timo Gültzow",
    image: "/images/timo_g.jpeg",
    description:
      "Student at Metropolia UAS | BEng, Information Technology",
    linkedin: "https://www.linkedin.com/in/timo-g/",
  },
  {
    name: "Philipp Thalemann",
    image: "/images/philipp_thalemann.jpeg",
    description:
      "Business Information Systems Student @ TU Braunschweig | Erasmus at Umeå University",
    linkedin: "https://www.linkedin.com/in/philipp-thalemann/",
  },
  {
    name: "Wisdom Ibeh",
    image: "/images/wisdom_ibeh.jpeg",
    description:
      "AI/ML Engineer building the systems that make models useful | AI agents, RAG, context & tool use",
    linkedin: "https://www.linkedin.com/in/wisdomibeh/",
    phone: "+234 814 072 6096",
    email: "wisdomekene2000@gmail.com",
  },
  {
    name: "Faithful Godwin",
    image: "/images/faithful.godwin.jpeg",
    description:
      "Founder | Bio Spark Fellow at Cambridge Gravity | First Nigerian Council Member at Workforce 2035 | Mobile App Developer | Driving Innovation and Collaboration",
    linkedin: "https://www.linkedin.com/in/faithful-godwin/",
    phone: "+234 810 512 4061",
    email: "faithfulgodwin2020@gmail.com",
  },
];

const contactItems = [
  { key: "linkedin", label: "LinkedIn", icon: "in" },
  { key: "phone", label: "Phone", icon: "☎" },
  { key: "email", label: "Email", icon: "✉" },
];

function SectionBackgroundCanvas({ color }) {
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const section = canvas.parentElement;

    const resize = () => {
      const width = section.clientWidth;
      const height = section.clientHeight;
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.fillStyle = color;
      context.fillRect(0, 0, width, height);
    };

    resize();
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(section);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return <canvas className="intro-section-background" ref={canvasRef} aria-hidden="true" />;
}

function ContactButton({ item, value }) {
  const href =
    item.key === "linkedin"
      ? value
      : item.key === "phone"
        ? `tel:${value.replace(/[^\d+]/g, "")}`
        : `mailto:${value}`;

  const content = (
    <>
      <span className="contact-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span>{item.label}</span>
    </>
  );

  return (
    <a
      className="contact-button"
      href={href}
      target={item.key === "linkedin" ? "_blank" : undefined}
      rel={item.key === "linkedin" ? "noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

function MemberCard({ member }) {
  const [expanded, setExpanded] = useState(false);
  const detailsRef = useRef(null);
  const hasDetails = Boolean(member.image || member.description);

  useLayoutEffect(() => {
    if (!expanded || !detailsRef.current) return;
    const animation = gsap.fromTo(
      detailsRef.current,
      { height: 0, opacity: 0, y: -14, scale: 0.98, transformOrigin: "top center" },
      { height: "auto", opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", clearProps: "height,transform" }
    );
    return () => animation.kill();
  }, [expanded]);

  const toggleDetails = () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }
    gsap.to(detailsRef.current, {
      height: 0,
      opacity: 0,
      y: -10,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => setExpanded(false),
    });
  };

  return (
    <article
      className={`member-card${!hasDetails ? " member-card--compact" : ""}${expanded ? " is-expanded" : ""}`}
    >
      <div className="member-info">
        <div className="member-card-summary">
          <div className="member-heading">
            <h2>{member.name}</h2>
          </div>
          <div className="contact-list" aria-label={`Contact ${member.name}`}>
            {contactItems
              .filter((item) => member[item.key])
              .map((item) => (
                <ContactButton key={item.key} item={item} value={member[item.key]} />
              ))}
          </div>
          {hasDetails && (
            <button
              className="member-toggle"
              type="button"
              aria-label={`${expanded ? "Collapse" : "Expand"} details for ${member.name}`}
              aria-expanded={expanded}
              onClick={toggleDetails}
            >
              <span aria-hidden="true" />
            </button>
          )}
        </div>
        {hasDetails && (
          <div className="member-details" ref={detailsRef}>
            {member.image && (
              <div className="member-image-wrap">
                <img
                  className="member-image"
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  loading="lazy"
                />
              </div>
            )}
            {member.description && <p className="member-description">{member.description}</p>}
          </div>
        )}
      </div>
    </article>
  );
}

export default function App() {
  const sinceAiRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          sinceAiRef.current,
          { autoAlpha: 0, y: 24, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }
        )
        .fromTo(
          ".since-ai-title",
          { autoAlpha: 0, y: 12, letterSpacing: "0.24em" },
          { autoAlpha: 1, y: 0, letterSpacing: "0.08em", duration: 0.6 },
          "-=0.35"
        );
    }, sinceAiRef);
    return () => context.revert();
  }, []);

  return (
    <div className="site-shell">
      <main>
        <section className="intro-section" id="top" aria-labelledby="hero-title">
          <h1 className="visually-hidden" id="hero-title">Team KEEP</h1>
          <SectionBackgroundCanvas color="#ffffff" />
          <KeepHero />
        </section>

        <section className="team-section" id="team" aria-labelledby="team-title">
          <VelocityDivider />
          <h2 className="visually-hidden" id="team-title">Team KEEP members</h2>
          <div className="team-grid">
            <section className="since-ai-group" ref={sinceAiRef} aria-labelledby="since-ai-title">
              <h3 className="since-ai-title" id="since-ai-title">At Since AI</h3>
              <div className="since-ai-grid">
                {members.slice(0, 4).map((member) => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </div>
            </section>
            {members.slice(4).map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        TEAM KEEP
      </footer>
    </div>
  );
}
