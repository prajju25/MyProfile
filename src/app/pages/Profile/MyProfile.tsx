import React from "react";
import { ProfileObject, SkillObject } from "../../Interface/ProfileObject";
import { useContent } from "../../hooks/useContent";
import { fillYears, yearsSince } from "../../utils/profile";
import Icon from "../../Components/Icons";
import Reveal from "../../Components/Reveal";
import { ErrorState, Loading } from "../../Components/StatusPanel";

const GROUP_COLORS = ["#39E6FF", "#A77BFF", "#4BFFB0", "#FFB547"];

const groupSkills = (skills: Array<SkillObject>) => {
  const groups = new Map<string, Array<SkillObject>>();
  skills.forEach((s) => {
    const key = s.category || "Other";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  });
  return Array.from(groups.entries()).map(([name, list], i) => ({
    name,
    color: GROUP_COLORS[i % GROUP_COLORS.length],
    skills: [...list].sort((a, b) => b.rating - a.rating),
  }));
};

const SkillBar = ({ skill, color }: { skill: SkillObject; color: string }) => (
  <div className="skill">
    <div className="skill-row">
      <span>{skill.name}</span>
      <span className="mono muted small">{skill.rating}/5</span>
    </div>
    <div className="segs" role="img" aria-label={`${skill.name}: ${skill.rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`seg${i <= skill.rating ? " lit" : ""}`}
          style={
            {
              "--seg-color": color,
              animationDelay: `${i * 80}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  </div>
);

const MyProfile = () => {
  const { data, loading, error } = useContent<{ data: Array<ProfileObject> }>("profile");
  const profile = data?.data[0];

  if (loading) return <Loading label="Loading profile" />;
  if (error || !profile)
    return <ErrorState message="Failed to fetch Profile data. Please try again after some time." />;

  const years = yearsSince(profile.careerStartDate);
  const [firstName, ...rest] = profile.name.split(" ");
  const social = profile.social ?? {};

  return (
    <div className="container page profile-page">
      <section className="panel id-card rise" aria-label="Identity">
        <div className="id-photo">
          <img src={profile.displayPicture} alt={`Portrait of ${profile.name}`} />
          <span className="bracket tl" />
          <span className="bracket br" />
          <span className="verified mono">● ID VERIFIED</span>
        </div>
        <div className="id-body">
          <span className="eyebrow mono">// OPERATOR PROFILE</span>
          <h1 className="id-name">
            {firstName}
            <br />
            <span className="accent">{rest.join(" ")}</span>
          </h1>
          <span className="id-role">{profile.designation.replace(" / ", " · ")}</span>
          <p className="muted">{fillYears(profile.description, years)}</p>
          <div className="pills">
            <a className="pill mono" href={`mailto:${profile.email}`}>
              <Icon name="mail" size={16} /> {profile.email}
            </a>
            {social.linkedIn && (
              <a className="pill mono" href={social.linkedIn} target="_blank" rel="noreferrer">
                <Icon name="linkedin" size={16} /> LinkedIn
              </a>
            )}
            {social.gitHub && (
              <a className="pill mono" href={social.gitHub} target="_blank" rel="noreferrer">
                <Icon name="github" size={16} /> GitHub
              </a>
            )}
            {profile.location && (
              <span className="pill mono">
                <Icon name="pin" size={16} /> {profile.location}
              </span>
            )}
          </div>
          {profile.resumeUrl && (
            <div>
              <a className="btn primary" href={profile.resumeUrl} download>
                DOWNLOAD RÉSUMÉ ↓
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="block" aria-labelledby="skills">
        <div className="section-head">
          <div className="stack-sm">
            <span className="eyebrow mono">// CAPABILITY MATRIX</span>
            <h2 id="skills" className="h2">
              Skills
            </h2>
          </div>
          <span className="mono muted small">POWER LEVEL 1–5</span>
        </div>
        <div className="skill-grid">
          {groupSkills(profile.skills).map((g, i) => (
            <Reveal key={g.name} className="panel skill-group" delay={i * 80}>
              <span className="group-title" style={{ color: g.color }}>
                {g.name}
              </span>
              {g.skills.map((s) => (
                <SkillBar key={s.name} skill={s} color={g.color} />
              ))}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="timeline">
        <div className="stack-sm">
          <span className="eyebrow mono">// MISSION LOG</span>
          <h2 id="timeline" className="h2">
            Work history
          </h2>
        </div>
        <div className="timeline">
          {profile.workHistory.map((w, i) => (
            <Reveal as="article" key={w.companyName + w.startDate} className="panel role">
              <span className={`t-node${i === 0 && w.endDate === "Present" ? " live" : ""}`} />
              <div className="role-head">
                <div className="stack-sm">
                  <h3 className="role-title">{w.role}</h3>
                  <span>
                    {w.companyName} · {w.location}
                  </span>
                </div>
                <span className="range mono">
                  {w.startDate.toUpperCase()} → {w.endDate.toUpperCase()}
                </span>
              </div>
              <ul className="role-points">
                {w.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {w.tech && w.tech.length > 0 && (
                <div className="tags">
                  {w.tech.map((t) => (
                    <span className="tag mono violet" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="edu">
        <div className="stack-sm">
          <span className="eyebrow mono">// TRAINING DATA</span>
          <h2 id="edu" className="h2">
            Education
          </h2>
        </div>
        <div className="edu-grid">
          {profile.education.map((e, i) => (
            <Reveal key={e.schoolName} className="panel edu" delay={i * 80}>
              <span className="mono muted small">
                {e.startDate} — {e.endDate}
              </span>
              <span className="edu-course">{e.courseName}</span>
              <span className="muted">{e.schoolName}</span>
              <span className="edu-score mono">
                {e.isPercentage ? `${e.marks}%` : `CGPA ${e.marks}`}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="split">
        <div className="split-main">
          <div className="stack-sm">
            <span className="eyebrow mono">// UNLOCKED</span>
            <h2 className="h2">Awards &amp; certifications</h2>
          </div>
          <div className="badges">
            {profile.certifications.map((c) => (
              <div className="badge" key={c.certificateName}>
                <span className="hex">
                  <Icon name="star" size={22} strokeWidth={2} />
                </span>
                <span className="stack-xs">
                  <span className="badge-title">{c.certificateName}</span>
                  <span className="mono muted small">
                    CERTIFICATION · {c.completedDate.toUpperCase()}
                  </span>
                </span>
              </div>
            ))}
            {profile.accomplishments.map((a) => (
              <div className="badge" key={a.title}>
                <span className="hex violet">
                  <Icon name="star" size={22} strokeWidth={2} />
                </span>
                <span className="stack-xs">
                  <span className="badge-title">{a.title}</span>
                  <span className="mono muted small">AWARD · {a.date.toUpperCase()}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="split-side">
          <div className="stack-sm">
            <span className="eyebrow mono">// OFF-DUTY</span>
            <h2 className="h2">Interests</h2>
          </div>
          <div className="pills">
            {profile.interests.map((i) => (
              <span className="pill" key={i}>
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfile;
