


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
  jobApplicationId: string | null;
}

export interface Class {
  id: string;
  name: string;
  collegeId: string;
  jobApplicationId: string | null;
}

export interface Employer {
  id: string;
  name: string;
  city: string;
  state: string;
  jobApplicationId: string | null;
}

export interface Position {
  id: string;
  name: string;
  employerId: string;
  dateStarted: Date;
  dateFinished: Date | null;
  jobApplicationId: string | null;
}

export interface WorkExperience {
  id: string;
  positionId: string;
  description: string;
  isVisible: boolean;
  order: number;
  position?: Position;
  employer?: Employer;
  jobApplicationId: string | null;
}

export interface Accomplishment {
  id: string;
  description: string;
  date: Date;
  jobApplicationId: string | null;
}

export interface Technology {
    id: string;
    name: string;
    order: number;
    jobApplicationId: string | null;
}

export interface Project {
  id: string;
  name: string;
  date: Date;
  shortDescription: string;
  description: string;
  imageThumbnailId: string;
  defaultOrder: number;
  technologyIds: string[];
  jobApplicationId: string | null;
}

export interface Image {
  id: string;
  description?: string;
  size: number;
  base64Content: string;
  projectId: string;
  order: number;
  jobApplicationId: string | null;
}

export interface Certification {
  id: string;
  name: string;
  vendor?: string;
  description: string;
  linkToSite: string;
  dateEarned: Date;
  jobApplicationId: string | null;
}

export type JobApplicationStatus = 'new' | 'ignore' | 'applied' | 'heard back' | 'interviewing' | 'nope' | 'offer!' | 'accepted';

export interface JobApplication {
  id: string;
  companyName: string;
  positionTitle: string;
  email: string;
  phoneNumber: string;
  location: 'hybrid' | 'remote' | 'on-site';
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
  paperSize: 'A4' | 'Letter';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | string;
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

export interface SkillTopic {
  id: string;
  name: string;
  order: number;
  jobApplicationId: string | null;
}

export interface SkillItem {
    id: string;
    description: string;
    skillTopicId: string;
    order: number;
    jobApplicationId: string | null;
}

export interface Interest {
  id: string;
  name: string;
  order: number;
  jobApplicationId: string | null;
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
