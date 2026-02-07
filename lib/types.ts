export interface College {
  id: string;
  name: string;
  degree: string;
  yearsAttended: string;
  yearGraduated: number;
  monthGraduated: string;
  city?: string;
  state?: string;
  gpa: number;
  isOnline?: boolean;
}

export interface Class {
  id: string;
  name: string;
  collegeId: string;
}

export interface Employer {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface Position {
  id: string;
  name: string;
  employerId: string;
  dateStarted: Date | string;
  dateFinished: Date | string | null;
}

export interface WorkExperience {
  id: string;
  positionId: string;
  description: string;
  isVisible: boolean;
  order: number;
  position?: Position;
  employer?: Employer;
}

export interface Accomplishment {
  id: string;
  description: string;
  date: Date | string;
}

export interface Project {
  id: string;
  name: string;
  date: Date | string;
  shortDescription: string;
  description: string;
  imageThumbnailId: string;
  defaultOrder: number;
  skillIds: string[];
}

export interface Image {
  id: string;
  description?: string;
  size: number;
  base64Content?: string;
  imageUrl?: string;
  projectId: string;
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  vendor?: string;
  description: string;
  linkToSite: string;
  dateEarned: Date | string;
  dateExpires?: Date | string;
}

export type JobApplicationStatus =
  | "new"
  | "ignore"
  | "applied"
  | "heard back"
  | "interviewing"
  | "nope"
  | "offer!"
  | "accepted";

export interface JobApplication {
  id: string;
  companyName: string;
  positionTitle: string;
  email: string;
  phoneNumber: string;
  location: "hybrid" | "remote" | "on-site";
  city?: string;
  state?: string;
  jobDescription: string;
  salary: string;
  personalNotes: string;
  ranking: number;
  linkToApplication: string;
  dateApplied: any;
  customUrl: string;
  welcomeNote: string;
  status: JobApplicationStatus;
  resumeGenerated: boolean;
  resumeWorkExperienceIds: string[];
  resumeCollegeIds: string[];
  resumeTemplateId: string;
  portfolioGenerated: boolean;
  portfolioProjectIds: string[];
  urlsActive: {
    welcome: boolean;
    resume: boolean;
    portfolio: boolean;
  };
}

export interface StatusEvent {
  id: string;
  jobApplicationId: string;
  eventType: JobApplicationStatus;
  comment: string;
  timestamp: any;
  order: number;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description?: string;
  ejsCode: string;
  cssCode?: string;
  jsCode?: string;
  paperSize: "A4" | "Letter";
  margins:
    | {
        top: number;
        bottom: number;
        left: number;
        right: number;
      }
    | string;
  createdDate: Date;
  isDefault: boolean;
  thumbnailUrl: string;
}

export interface ResumeDraft {
  id: string;
  jobTitle: string;
  companyName: string;
  dateCreated: Date;
  workExperienceIds: string[];
  collegeIds: string[];
  templateId: string;
}

export interface Skill {
  id: string;
  description: string;
  order: number;
}

export interface Interest {
  id: string;
  name: string;
  order: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  summary?: string;
  contactEmail?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
}
