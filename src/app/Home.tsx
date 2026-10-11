import React from "react";
import { Link } from "react-router-dom";
import * as ApiConstants from "./Constants/ApiConstant";
import { useContent } from "./hooks/useContent";
import { ProfileObject } from "./Interface/ProfileObject";
import { AppsObject } from "./Interface/AppsObject";
import { sortApps, yearsSince } from "./utils/profile";
import Icon from "./Components/Icons";
import Reveal from "./Components/Reveal";
import HeroRing, { RingTile } from "./Components/scenes/HeroRing";
import StorySplit, { StoryStep } from "./Components/scenes/StorySplit";
import StatsCascade, { CascadeStat } from "./Components/scenes/StatsCascade";
import WordSpread from "./Components/scenes/WordSpread";
import HorizontalApps from "./Components/scenes/HorizontalApps";

const PORTRAIT = "/DSC_1981.jpeg";
const FALLBACK_SKILLS = ["ReactJS", "JavaScript", "TypeScript", "Angular", "Spring Boot", "NodeJS"];

const buildRing = (apps: Array<AppsObject>, years: number): Array<RingTile> => {
  const covers = apps.filter((a) => a.imageUrl).map((a) => ({ src: a.imageUrl!, label: a.name }));
  const texts: Array<RingTile> = [
    { kind: "text", title: `${years}+`, label: "YEARS SHIPPING", tone: "cyan" },
    { kind: "text", title: "React · Angular", label: "FRONTEND CORE", tone: "violet" },
    { kind: "text", title: "300+", label: "INTERVIEWS", tone: "green" },
    { kind: "text", title: "Spring Boot", label: "BACKEND", tone: "amber" },
  ];
  const images: Array<RingTile> = [
    ...covers.map((c) => ({ kind: "image" as const, src: c.src, label: c.label.toUpperCase() })),
    { kind: "image", src: PORTRAIT, label: "OPERATOR" },
  ];
  // Alternate images and text tiles so the ring reads as a mix.
  const out: Array<RingTile> = [];
  for (let i = 0; i < Math.max(images.length, texts.length); i++) {
    if (images[i]) out.push(images[i]);
    if (texts[i]) out.push(texts[i]);
  }
  return out;
};

const buildStory = (years: number, startYear: number): Array<StoryStep> => [
  {
    kicker: `// ${startYear} · BOOT SEQUENCE`,
    title: `Started in ${startYear}`,
    body: "Joined Accenture in Bengaluru and shipped features used by 9,000+ customers — including an AngularJS → Angular 8 migration that made production pages 30% faster.",
    tone: "rgba(57, 230, 255, 0.16)",
  },
  {
    kicker: "// LEVEL UP",
    title: "Then I started leading",
    body: "Technical POC, UI SME, mentor. At Brillio I lead offshore teams, build React and Spring Boot platforms from scratch, and have interviewed 300+ engineers.",
    tone: "rgba(167, 123, 255, 0.18)",
  },
  {
    kicker: "// CORE BELIEF",
    title: "Complex tech should feel like magic",
    body: "Accessibility, performance and craft aren't extras — they're the product. Every screen should feel effortless to the person using it.",
    tone: "rgba(75, 255, 176, 0.13)",
  },
  {
    kicker: "// STILL BUILDING",
    title: `${years}+ years in, still shipping`,
    body: "Real-time multiplayer games, AI content studios, everyday tools — the App Lab never closes.",
    tone: "rgba(255, 181, 71, 0.15)",
  },
];

const toNumber = (v: string) => Number(String(v).replace(/[^0-9.]/g, "")) || 0;

const Home = () => {
  const profileRes = useContent<{ data: Array<ProfileObject> }>("profile");
  const appsRes = useContent<Array<AppsObject>>("apps");
  const profile = profileRes.data?.data[0];
  const apps = sortApps(appsRes.data ?? []);

  const startDate = profile?.careerStartDate ?? "2014-09-01";
  const years = yearsSince(startDate);
  const startYear = new Date(startDate).getFullYear() || 2014;

  const stats: Array<CascadeStat> = [
    { value: years, suffix: "+", label: "Years in the industry" },
    ...(profile?.stats ?? []).map((s) => ({ value: toNumber(s.value), suffix: s.suffix ?? "", label: s.label })),
    ...(apps.length ? [{ value: apps.length, suffix: "", label: "Apps in the lab" }] : []),
  ];

  const covers = apps.filter((a) => a.imageUrl).map((a) => a.imageUrl!);
  const skills = profile?.skills.map((s) => s.name) ?? FALLBACK_SKILLS;
  const ticker = [...skills, ...skills];

  return (
    <div className="home">
      <HeroRing tiles={buildRing(apps, years)} />

      <StorySplit steps={buildStory(years, startYear)} portrait={profile?.displayPicture ?? PORTRAIT} />

      <StatsCascade stats={stats} images={[...covers, PORTRAIT]} />

      <WordSpread lines={["Things I've built", "with code, caffeine", "& curiosity."]} accentFrom={4} />

      {apps.length > 0 && <HorizontalApps apps={apps} />}

      <section className="container section portals-section" aria-labelledby="portals">
        <div className="section-head">
          <h2 id="portals" className="h2">
            Choose a portal
          </h2>
          <span className="mono muted small">03 DESTINATIONS ONLINE</span>
        </div>
        <div className="card-grid">
          <Reveal>
            <Link className="portal" to="/profile">
              <span className="corner tl" />
              <span className="corner br" />
              <span className="mono portal-code">PORTAL 01</span>
              <Icon name="idcard" size={48} strokeWidth={1.4} className="accent" />
              <span className="portal-title">Career Log</span>
              <span className="muted">
                {years} years, two companies, one timeline. Roles, wins, skills and certifications.
              </span>
              <span className="mono portal-cta">ENTER →</span>
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Link className="portal violet" to="/apps">
              <span className="corner tl" />
              <span className="corner br" />
              <span className="mono portal-code">PORTAL 02</span>
              <Icon name="flask" size={48} strokeWidth={1.4} className="violet-text" />
              <span className="portal-title">App Lab</span>
              <span className="muted">Side projects and experiments I've designed, built and shipped.</span>
              <span className="mono portal-cta">ENTER →</span>
            </Link>
          </Reveal>
          <Reveal delay={200}>
            <Link className="portal" to="/photography">
              <span className="corner tl" />
              <span className="corner br" />
              <span className="mono portal-code">
                PORTAL 03 <span className="beta-text">● CALIBRATING</span>
              </span>
              <Icon name="camera" size={48} strokeWidth={1.4} className="accent" />
              <span className="portal-title">Photography</span>
              <span className="muted">Frames from the road. The gallery is being developed — check back soon.</span>
              <span className="mono portal-cta">PEEK →</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="ticker" aria-label="Skills">
        <div className="marquee">
          {ticker.map((s, i) => (
            <span key={`${s}-${i}`} aria-hidden={i >= skills.length}>
              {s} <span className="accent">✦</span>
            </span>
          ))}
        </div>
      </section>

      <section className="container contact">
        <div className="contact-copy">
          <span className="eyebrow mono">// OPEN CHANNEL</span>
          <span className="contact-title">
            Let's build something
            <br />
            that feels like the future.
          </span>
        </div>
        <a className="btn primary" href={`mailto:${ApiConstants.CONTACT_EMAIL}`}>
          SEND A TRANSMISSION <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
};
export default Home;
