export interface ProfileObject {
  displayPicture: string;
  name: string;
  designation: string;
  location: string;
  careerStartDate: string;
  email: string;
  resumeUrl?: string;
  social: SocialLinks;
  stats: Array<StatObject>;
  skills: Array<SkillObject>;
  description: string;
  workHistory: Array<WorkHistoryObject>;
  education: Array<EducationObject>;
  accomplishments: Array<AccomplishmentObject>;
  certifications: Array<CertificationObject>;
  interests: Array<string>;
}
export interface SocialLinks {
  gitHub?: string;
  linkedIn?: string;
  twitter?: string;
  instagram?: string;
}
export interface StatObject {
  value: string;
  suffix?: string;
  label: string;
}
export interface SkillObject {
  name: string;
  rating: number;
  category: string;
}
export interface WorkHistoryObject {
  role: string;
  startDate: string;
  endDate: string;
  companyName: string;
  location: string;
  description: Array<string>;
  tech?: Array<string>;
}
export interface EducationObject {
  courseName: string;
  startDate: string;
  endDate: string;
  schoolName: string;
  isPercentage: boolean;
  marks: string;
}
export interface AccomplishmentObject {
  title: string;
  date: string;
  detail?: string;
}
export interface CertificationObject {
  certificateName: string;
  completedDate: string;
}
