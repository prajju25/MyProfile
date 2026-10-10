import React from "react";
import { Link } from "react-router-dom";
import * as ApiConstants from "./Constants/ApiConstant";
import { useContent } from "./hooks/useContent";
import { ProfileObject } from "./Interface/ProfileObject";
import { AppsObject } from "./Interface/AppsObject";
import { sortApps, yearsSince } from "./utils/profile";
import Icon from "./Components/Icons";
import Reveal from "./Components/Reveal";
import { AppImage, StatusTag, TechTags } from "./Components/AppMedia";

const FALLBACK_SKILLS = ["ReactJS", "JavaScript", "TypeScript", "Angular", "Spring Boot", "NodeJS"];

const Home = () => {
  const profileRes = useContent<{ data: Array<ProfileObject> }>("profile");
  const appsRes = useContent<Array<AppsObject>>("apps");
  const profile = profileRes.data?.data[0];
  const apps = sortApps(appsRes.data ?? []);
  const featured = apps.filter((a) => a.featured).slice(0, 3);

  const years = profile ? yearsSince(profile.careerStartDate) : null;
  const stats = [
    ...(years ? [{ value: String(years), suffix: "+", label: "Years in the industry" }] : []),
    ...(profile?.stats ?? []),
    ...(apps.length
      ? [{ value: String(apps.length).padStart(2, "0"), suffix: "", label: "Apps in the lab" }]
      : []),
  ];
  const skills = profile?.skills.map((s) => s.name) ?? FALLBACK_SKILLS;
  const ticker = [...skills, ...skills];

  return (
    <>
      <section className="container hero">
        <div className="hero-copy rise">
          <span className="eyebrow mono">
            <span className="live-dot" />
            // SYS.ID — A BIT ABOUT ME
          </span>
          <h1 className="hero-title">
            Who
            <br />
            am <span className="glow">I?</span>
            <span className="caret" aria-hidden="true" />
          </h1>
          <p className="lead">
            Hello! I'm <strong>Prajwal Kotian</strong> — Senior Frontend / Fullstack Lead by
            profession, digital explorer by choice. When I'm not orchestrating the perfect blend
            of JavaScript and caffeine, I'm busy transforming complex tech into user-friendly
            magic.
          </p>
          <p className="muted">
            Career milestones, lessons learned, and maybe a few coding bloopers (hey, nobody's
            perfect!). Dive in and see where the pixels and persistence have taken me so far.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/profile">
              EXPLORE MY CAREER <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn ghost" to="/apps">
              LAUNCH APP LAB
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit">
            <span className="ring r3" />
            <span className="ring r2">
              <span className="node violet" />
            </span>
            <span className="ring r1">
              <span className="node" />
            </span>
            <div className="portrait">
              <img src="/DSC_1981.jpeg" alt="Portrait of Prajwal Kotian" />
            </div>
            <span className="chip mono c1">
              <span className="live-dot" />
              STATUS · BUILDING
            </span>
            <span className="chip mono c2">LOC · BENGALURU, IN</span>
            <span className="chip mono c3">STACK · REACT / ANGULAR / SPRING</span>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <Reveal as="section" className="container section" aria-label="Quick stats">
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-value">
                  {s.value}
                  <span className="accent">{s.suffix}</span>
                </span>
                <span className="stat-label mono">{s.label.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <section className="container section" aria-labelledby="portals">
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
                {years ? `${years} years` : "A decade+"}, two companies, one timeline. Roles,
                wins, skills and certifications.
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
              <span className="muted">
                Side projects and experiments I've designed, built and shipped.
              </span>
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
              <span className="muted">
                Frames from the road. The gallery is being developed — check back soon.
              </span>
              <span className="mono portal-cta">PEEK →</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container section" aria-labelledby="featured">
          <div className="section-head">
            <h2 id="featured" className="h2">
              Featured builds
            </h2>
            <Link to="/apps" className="mono small text-link">
              VIEW ALL IN APP LAB →
            </Link>
          </div>
          <div className="card-grid">
            {featured.map((app, i) => (
              <Reveal key={app.id} delay={i * 100}>
                <Link className="app-card" to={`/apps?app=${app.id}`}>
                  <span className="app-card-media">
                    <AppImage app={app} />
                  </span>
                  <span className="app-card-body">
                    <span className="app-card-head">
                      <span className="app-card-title">{app.name}</span>
                      <StatusTag status={app.status} />
                    </span>
                    <span className="muted">{app.tagline}</span>
                    <TechTags items={app.techStack} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

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
    </>
  );
};
export default Home;
