import React from "react";

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
  return (
    <article className="member-card">
      <div className="member-image-wrap">
        <img
          className="member-image"
          src={member.image}
          alt={`Portrait of ${member.name}`}
          loading="lazy"
        />
      </div>
      <div className="member-info">
        <div className="member-heading">
          <h2>{member.name}</h2>
        </div>
        <p className="member-description">{member.description}</p>
        <div className="contact-list" aria-label={`Contact ${member.name}`}>
          {contactItems.map((item) => (
            <ContactButton
              key={item.key}
              item={item}
              value={member[item.key]}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="header-brand" href="#top">
          TEAM KEEP
        </a>
        <a className="header-link" href="#team">
          Team
        </a>
      </header>

      <main>
        <section className="intro-section" id="top" aria-labelledby="hero-title">
          <h1 id="hero-title">KEEP</h1>
        </section>

        <section className="team-section" id="team" aria-labelledby="team-title">
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
