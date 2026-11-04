import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import KeepHero from "./KeepHero.jsx";
import VelocityDivider from "./VelocityDivider.jsx";

const members = [
  {
    name: "Özge Şahin",
    image: "/images/ozge_sahin.jpeg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a tellus at justo pharetra posuere.",
    linkedin: "https://www.linkedin.com/in/ozgesahin05/",
    phone: "+90 541 710 84 17",
    email: "Ozge.Sahin@student.lut.fi",
  },
  {
    name: "Wisdom Ibeh",
    image: "/images/wisdom_ibeh.jpeg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer quis velit vitae erat tincidunt.",
    linkedin: "https://www.linkedin.com/in/wisdomibeh/",
    phone: "+234 814 072 6096",
    email: "wisdomekene2000@gmail.com",
  },
  {
    name: "Arthur Lagerlöf",
    image: "/images/arthur_lagerlof.jpeg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at neque vel nisl commodo vulputate.",
    linkedin: "https://www.linkedin.com/in/arthur-lagerl%C3%B6f-85031927b/",
    phone: "+358406347109",
    email: "arthur.lagerlof@abo.fi",
  },
  {
    name: "Faithful Godwin",
    image: "/images/faithful.godwin.jpeg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae augue sed nulla efficitur laoreet.",
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
    <article className={`member-card${expanded ? " is-expanded" : ""}`}>
      <div className="member-info">
        <div className="member-card-summary">
          <div className="member-heading">
            <h2>{member.name}</h2>
          </div>
          <div className="contact-list" aria-label={`Contact ${member.name}`}>
            {contactItems.map((item) => (
              <ContactButton key={item.key} item={item} value={member[item.key]} />
            ))}
          </div>
          <button
            className="member-toggle"
            type="button"
            aria-label={`${expanded ? "Collapse" : "Expand"} details for ${member.name}`}
            aria-expanded={expanded}
            onClick={toggleDetails}
          >
            <span aria-hidden="true" />
          </button>
        </div>
        <div className="member-details" ref={detailsRef}>
          <div className="member-image-wrap">
            <img
              className="member-image"
              src={member.image}
              alt={`Portrait of ${member.name}`}
              loading="lazy"
            />
          </div>
          <p className="member-description">{member.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function App() {
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
            {members.map((member) => (
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
