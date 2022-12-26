export interface ProfileObject {
    displayPicture: string;
    name: string;
    designation: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    phoneNumber: string;
    email: string;
    linkedInURL: string;
    gitHubURL: string;
    skills: Array<SkillObject>;
    description: string;
    workHistory: Array<WorkHistoryObject>;
    education: Array<EducationObject>;
    accomplishments: Array<string>;
    certifications: Array<CertificationObject>;
    interests: Array<string>;
}
export interface SkillObject {
    name: string;
    rating: number;
}
export interface WorkHistoryObject {
    role: string;
    startDate: string;
    endDate: string;
    companyName: string;
    location: string;
    description: Array<string>;
}
export interface EducationObject {
    courseName: string;
    startDate: string;
    endDate: string;
    schoolName: string;
    isPercentage: boolean;
    marks: number;
}
export interface CertificationObject {
    certificateName: string;
    completedDate: string;
}