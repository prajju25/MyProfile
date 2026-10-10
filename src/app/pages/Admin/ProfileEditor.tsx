import React from "react";
import {
  AccomplishmentObject,
  CertificationObject,
  EducationObject,
  ProfileObject,
  SkillObject,
  StatObject,
  WorkHistoryObject,
} from "../../Interface/ProfileObject";
import {
  CheckboxField,
  ImageField,
  LinesField,
  Repeater,
  Section,
  SelectField,
  TagsField,
  TextAreaField,
  TextField,
} from "./fields";
import { AdminApi } from "./adminApi";

const RATINGS = [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n} / 5` }));

const ProfileEditor = ({
  profile,
  onChange,
  api,
}: {
  profile: ProfileObject;
  onChange: (p: ProfileObject) => void;
  api: AdminApi;
}) => {
  const set = <K extends keyof ProfileObject>(key: K, value: ProfileObject[K]) =>
    onChange({ ...profile, [key]: value });
  const social = profile.social ?? {};
  const skillCategories = Array.from(new Set((profile.skills ?? []).map((s) => s.category).filter(Boolean)));

  return (
    <div className="editor-stack">
      <Section title="Basics" defaultOpen>
        <div className="form-grid">
          <TextField label="Name" value={profile.name} onChange={(v) => set("name", v)} required />
          <TextField label="Designation" value={profile.designation} onChange={(v) => set("designation", v)} />
          <TextField label="Location" value={profile.location} onChange={(v) => set("location", v)} />
          <TextField
            label="Career start date"
            type="date"
            value={profile.careerStartDate}
            onChange={(v) => set("careerStartDate", v)}
            hint="Used to calculate years of experience"
          />
          <TextField label="Email" type="email" value={profile.email} onChange={(v) => set("email", v)} />
          <TextField
            label="Résumé URL"
            value={profile.resumeUrl}
            onChange={(v) => set("resumeUrl", v)}
            hint="Leave empty to hide the download button"
          />
        </div>
        <ImageField
          label="Display picture"
          value={profile.displayPicture}
          onChange={(v) => set("displayPicture", v)}
          upload={api.upload}
        />
        <TextAreaField
          label="Summary"
          rows={6}
          value={profile.description}
          onChange={(v) => set("description", v)}
          hint="Write {years} and it is replaced with your years of experience"
        />
      </Section>

      <Section title="Social links">
        <div className="form-grid">
          {(["gitHub", "linkedIn", "twitter", "instagram"] as const).map((key) => (
            <TextField
              key={key}
              label={key}
              type="url"
              value={social[key]}
              onChange={(v) => set("social", { ...social, [key]: v })}
            />
          ))}
        </div>
      </Section>

      <Section title="Home stats" count={profile.stats?.length}>
        <p className="field-hint">Years of experience and app count are added automatically.</p>
        <Repeater<StatObject>
          compact
          items={profile.stats}
          onChange={(v) => set("stats", v)}
          newItem={() => ({ value: "", suffix: "+", label: "" })}
          itemLabel={(s) => s.label}
          addLabel="ADD STAT"
          renderItem={(s, update) => (
            <div className="form-grid three">
              <TextField label="Value" value={s.value} onChange={(v) => update({ value: v })} />
              <TextField label="Suffix" value={s.suffix} onChange={(v) => update({ suffix: v })} />
              <TextField label="Label" value={s.label} onChange={(v) => update({ label: v })} />
            </div>
          )}
        />
      </Section>

      <Section title="Skills" count={profile.skills?.length}>
        <datalist id="skill-categories">
          {skillCategories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <Repeater<SkillObject>
          compact
          items={profile.skills}
          onChange={(v) => set("skills", v)}
          newItem={() => ({ name: "", rating: 3, category: skillCategories[0] ?? "Frontend" })}
          itemLabel={(s) => s.name}
          addLabel="ADD SKILL"
          renderItem={(s, update) => (
            <div className="form-grid three">
              <TextField label="Skill" value={s.name} onChange={(v) => update({ name: v })} />
              <SelectField label="Level" value={s.rating} options={RATINGS} onChange={(v) => update({ rating: v })} />
              <TextField
                label="Category"
                value={s.category}
                list="skill-categories"
                onChange={(v) => update({ category: v })}
              />
            </div>
          )}
        />
      </Section>

      <Section title="Work history" count={profile.workHistory?.length}>
        <Repeater<WorkHistoryObject>
          items={profile.workHistory}
          onChange={(v) => set("workHistory", v)}
          newItem={() => ({
            role: "",
            companyName: "",
            location: "",
            startDate: "",
            endDate: "Present",
            description: [],
            tech: [],
          })}
          itemLabel={(w) => [w.role, w.companyName].filter(Boolean).join(" · ")}
          addLabel="ADD ROLE"
          renderItem={(w, update) => (
            <>
              <div className="form-grid">
                <TextField label="Role" value={w.role} onChange={(v) => update({ role: v })} />
                <TextField label="Company" value={w.companyName} onChange={(v) => update({ companyName: v })} />
                <TextField label="Location" value={w.location} onChange={(v) => update({ location: v })} />
                <div className="form-grid">
                  <TextField
                    label="Start"
                    value={w.startDate}
                    placeholder="April 2021"
                    onChange={(v) => update({ startDate: v })}
                  />
                  <TextField
                    label="End"
                    value={w.endDate}
                    placeholder="Present"
                    onChange={(v) => update({ endDate: v })}
                  />
                </div>
              </div>
              <LinesField
                label="Highlights"
                rows={6}
                value={w.description}
                onChange={(v) => update({ description: v })}
              />
              <TagsField label="Tech used" value={w.tech} onChange={(v) => update({ tech: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Education" count={profile.education?.length}>
        <Repeater<EducationObject>
          items={profile.education}
          onChange={(v) => set("education", v)}
          newItem={() => ({
            courseName: "",
            schoolName: "",
            startDate: "",
            endDate: "",
            isPercentage: false,
            marks: "",
          })}
          itemLabel={(e) => e.courseName}
          addLabel="ADD EDUCATION"
          renderItem={(e, update) => (
            <div className="form-grid">
              <TextField label="Course" value={e.courseName} onChange={(v) => update({ courseName: v })} />
              <TextField label="School" value={e.schoolName} onChange={(v) => update({ schoolName: v })} />
              <TextField label="Start" value={e.startDate} onChange={(v) => update({ startDate: v })} />
              <TextField label="End" value={e.endDate} onChange={(v) => update({ endDate: v })} />
              <TextField label="Score" value={e.marks} onChange={(v) => update({ marks: v })} />
              <CheckboxField
                label="Score is a percentage"
                hint="unchecked = CGPA"
                checked={e.isPercentage}
                onChange={(v) => update({ isPercentage: v })}
              />
            </div>
          )}
        />
      </Section>

      <Section title="Certifications" count={profile.certifications?.length}>
        <Repeater<CertificationObject>
          compact
          items={profile.certifications}
          onChange={(v) => set("certifications", v)}
          newItem={() => ({ certificateName: "", completedDate: "" })}
          itemLabel={(c) => c.certificateName}
          addLabel="ADD CERTIFICATION"
          renderItem={(c, update) => (
            <div className="form-grid">
              <TextField
                label="Certificate"
                value={c.certificateName}
                onChange={(v) => update({ certificateName: v })}
              />
              <TextField
                label="Completed"
                value={c.completedDate}
                placeholder="Dec 2023"
                onChange={(v) => update({ completedDate: v })}
              />
            </div>
          )}
        />
      </Section>

      <Section title="Awards" count={profile.accomplishments?.length}>
        <Repeater<AccomplishmentObject>
          compact
          items={profile.accomplishments}
          onChange={(v) => set("accomplishments", v)}
          newItem={() => ({ title: "", date: "", detail: "" })}
          itemLabel={(a) => a.title}
          addLabel="ADD AWARD"
          renderItem={(a, update) => (
            <div className="form-grid three">
              <TextField label="Title" value={a.title} onChange={(v) => update({ title: v })} />
              <TextField label="Date" value={a.date} onChange={(v) => update({ date: v })} />
              <TextField label="Detail" value={a.detail} onChange={(v) => update({ detail: v })} />
            </div>
          )}
        />
      </Section>

      <Section title="Interests" count={profile.interests?.length}>
        <LinesField label="Interests" value={profile.interests} onChange={(v) => set("interests", v)} />
      </Section>
    </div>
  );
};

export default ProfileEditor;
