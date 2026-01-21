// NOTE: This module is server-only. We lazy-require Node/native deps to avoid bundling them in the client.
let Database: any; // loaded lazily on the server
let path: any;
import {
  College,
  Employer,
  Position,
  WorkExperience,
  Technology,
  Project,
  Image,
  Certification,
  JobApplication,
  SkillTopic,
  SkillItem,
  Interest,
  UserProfile,
} from '@/lib/types';

let db: any | null = null;

// Initialize database connection
function getDb(): any {
  if (typeof window !== 'undefined') {
    throw new Error('db.ts is server-only; move calls behind server actions or API routes.');
  }

  if (!Database) {
    Database = require('better-sqlite3');
  }
  if (!path) {
    path = require('path');
  }
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data.db');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  
  return db;
}

// ==================== COLLEGES ====================

export function createCollege(college: Omit<College, 'id'>): College {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    `INSERT INTO colleges (id, name, degree, years_attended, year_graduated, month_graduated, city, state, gpa, is_online)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, college.name, college.degree, college.yearsAttended, college.yearGraduated, 
     college.monthGraduated, college.city, college.state, college.gpa, college.isOnline ? 1 : 0);
  return { id, ...college };
}

export function getColleges(): College[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM colleges ORDER BY year_graduated DESC').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    degree: row.degree,
    yearsAttended: row.years_attended,
    yearGraduated: row.year_graduated,
    monthGraduated: row.month_graduated,
    city: row.city,
    state: row.state,
    gpa: row.gpa,
    isOnline: Boolean(row.is_online),
  }));
}

export function getCollegeById(id: string): College | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM colleges WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    degree: row.degree,
    yearsAttended: row.years_attended,
    yearGraduated: row.year_graduated,
    monthGraduated: row.month_graduated,
    city: row.city,
    state: row.state,
    gpa: row.gpa,
    isOnline: Boolean(row.is_online),
  };
}

export function updateCollege(id: string, college: Partial<Omit<College, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (college.name !== undefined) { fields.push('name = ?'); values.push(college.name); }
  if (college.degree !== undefined) { fields.push('degree = ?'); values.push(college.degree); }
  if (college.yearsAttended !== undefined) { fields.push('years_attended = ?'); values.push(college.yearsAttended); }
  if (college.yearGraduated !== undefined) { fields.push('year_graduated = ?'); values.push(college.yearGraduated); }
  if (college.monthGraduated !== undefined) { fields.push('month_graduated = ?'); values.push(college.monthGraduated); }
  if (college.city !== undefined) { fields.push('city = ?'); values.push(college.city); }
  if (college.state !== undefined) { fields.push('state = ?'); values.push(college.state); }
  if (college.gpa !== undefined) { fields.push('gpa = ?'); values.push(college.gpa); }
  if (college.isOnline !== undefined) { fields.push('is_online = ?'); values.push(college.isOnline ? 1 : 0); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE colleges SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCollege(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM colleges WHERE id = ?').run(id);
}

// ==================== EMPLOYERS ====================

export function createEmployer(employer: Omit<Employer, 'id'>): Employer {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO employers (id, name, city, state) VALUES (?, ?, ?, ?)'
  ).run(id, employer.name, employer.city, employer.state);
  return { id, ...employer };
}

export function getEmployers(): Employer[] {
  const database = getDb();
  return database.prepare('SELECT * FROM employers ORDER BY name').all() as Employer[];
}

export function getEmployerById(id: string): Employer | null {
  const database = getDb();
  return database.prepare('SELECT * FROM employers WHERE id = ?').get(id) as Employer | undefined || null;
}

export function updateEmployer(id: string, employer: Partial<Omit<Employer, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (employer.name !== undefined) { fields.push('name = ?'); values.push(employer.name); }
  if (employer.city !== undefined) { fields.push('city = ?'); values.push(employer.city); }
  if (employer.state !== undefined) { fields.push('state = ?'); values.push(employer.state); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE employers SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteEmployer(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM employers WHERE id = ?').run(id);
}

// ==================== POSITIONS ====================

export function createPosition(position: Omit<Position, 'id'>): Position {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO positions (id, name, employer_id, date_started, date_finished) VALUES (?, ?, ?, ?, ?)'
  ).run(id, position.name, position.employerId, position.dateStarted.toISOString(), 
     position.dateFinished ? position.dateFinished.toISOString() : null);
  return { id, ...position };
}

export function getPositions(): Position[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM positions ORDER BY date_started DESC').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    employerId: row.employer_id,
    dateStarted: new Date(row.date_started),
    dateFinished: row.date_finished ? new Date(row.date_finished) : null,
  }));
}

export function getPositionById(id: string): Position | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM positions WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    employerId: row.employer_id,
    dateStarted: new Date(row.date_started),
    dateFinished: row.date_finished ? new Date(row.date_finished) : null,
  };
}

export function updatePosition(id: string, position: Partial<Omit<Position, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (position.name !== undefined) { fields.push('name = ?'); values.push(position.name); }
  if (position.employerId !== undefined) { fields.push('employer_id = ?'); values.push(position.employerId); }
  if (position.dateStarted !== undefined) { fields.push('date_started = ?'); values.push(position.dateStarted.toISOString()); }
  if (position.dateFinished !== undefined) { fields.push('date_finished = ?'); values.push(position.dateFinished ? position.dateFinished.toISOString() : null); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE positions SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deletePosition(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM positions WHERE id = ?').run(id);
}

// ==================== WORK EXPERIENCES ====================

export function createWorkExperience(workExp: Omit<WorkExperience, 'id'>): WorkExperience {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO work_experiences (id, position_id, description, is_visible, order_index) VALUES (?, ?, ?, ?, ?)'
  ).run(id, workExp.positionId, workExp.description, workExp.isVisible ? 1 : 0, workExp.order);
  return { id, ...workExp };
}

export function getWorkExperiences(): WorkExperience[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM work_experiences ORDER BY order_index').all() as any[];
  return rows.map(row => ({
    id: row.id,
    positionId: row.position_id,
    description: row.description,
    isVisible: Boolean(row.is_visible),
    order: row.order_index,
  }));
}

export function getWorkExperienceById(id: string): WorkExperience | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM work_experiences WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    positionId: row.position_id,
    description: row.description,
    isVisible: Boolean(row.is_visible),
    order: row.order_index,
  };
}

export function getWorkExperiencesWithDetails(): WorkExperience[] {
  const database = getDb();
  const rows = database.prepare(`
    SELECT we.*, p.name as position_name, p.date_started, p.date_finished,
           e.name as employer_name, e.city, e.state, e.id as employer_id
    FROM work_experiences we
    JOIN positions p ON we.position_id = p.id
    JOIN employers e ON p.employer_id = e.id
    ORDER BY we.order_index
  `).all() as any[];
  return rows.map(row => ({
    id: row.id,
    positionId: row.position_id,
    description: row.description,
    isVisible: Boolean(row.is_visible),
    order: row.order_index,
    position: {
      id: row.position_id,
      name: row.position_name,
      employerId: row.employer_id,
      dateStarted: new Date(row.date_started),
      dateFinished: row.date_finished ? new Date(row.date_finished) : null,
    },
    employer: {
      id: row.employer_id,
      name: row.employer_name,
      city: row.city,
      state: row.state,
    },
  }));
}

export function updateWorkExperience(id: string, workExp: Partial<Omit<WorkExperience, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (workExp.positionId !== undefined) { fields.push('position_id = ?'); values.push(workExp.positionId); }
  if (workExp.description !== undefined) { fields.push('description = ?'); values.push(workExp.description); }
  if (workExp.isVisible !== undefined) { fields.push('is_visible = ?'); values.push(workExp.isVisible ? 1 : 0); }
  if (workExp.order !== undefined) { fields.push('order_index = ?'); values.push(workExp.order); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE work_experiences SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteWorkExperience(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM work_experiences WHERE id = ?').run(id);
}

// ==================== TECHNOLOGIES ====================

export function createTechnology(tech: Omit<Technology, 'id'>): Technology {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO technologies (id, name, order_index) VALUES (?, ?, ?)'
  ).run(id, tech.name, tech.order);
  return { id, ...tech };
}

export function getTechnologies(): Technology[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM technologies ORDER BY order_index').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    order: row.order_index,
  }));
}

export function getTechnologyById(id: string): Technology | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM technologies WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    order: row.order_index,
  };
}

export function updateTechnology(id: string, tech: Partial<Omit<Technology, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (tech.name !== undefined) { fields.push('name = ?'); values.push(tech.name); }
  if (tech.order !== undefined) { fields.push('order_index = ?'); values.push(tech.order); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE technologies SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteTechnology(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM technologies WHERE id = ?').run(id);
}

// ==================== PROJECTS ====================

export function createProject(project: Omit<Project, 'id'>): Project {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    `INSERT INTO projects (id, name, date, short_description, description, image_thumbnail_id, default_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, project.name, project.date.toISOString(), project.shortDescription, 
     project.description, project.imageThumbnailId, project.defaultOrder);

  // Add technology associations
  if (project.technologyIds && project.technologyIds.length > 0) {
    const stmt = database.prepare('INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)');
    for (const techId of project.technologyIds) {
      stmt.run(id, techId);
    }
  }

  return { id, ...project };
}

export function getProjects(): Project[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM projects ORDER BY default_order').all() as any[];
  
  const projects = rows.map((row) => {
    const techRows = database.prepare(
      'SELECT technology_id FROM project_technologies WHERE project_id = ?'
    ).all(row.id) as any[];
    return {
      id: row.id,
      name: row.name,
      date: new Date(row.date),
      shortDescription: row.short_description,
      description: row.description,
      imageThumbnailId: row.image_thumbnail_id,
      defaultOrder: row.default_order,
      technologyIds: techRows.map(t => t.technology_id),
    };
  });

  return projects;
}

export function getProjectById(id: string): Project | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
  if (!row) return null;

  const techRows = database.prepare(
    'SELECT technology_id FROM project_technologies WHERE project_id = ?'
  ).all(id) as any[];

  return {
    id: row.id,
    name: row.name,
    date: new Date(row.date),
    shortDescription: row.short_description,
    description: row.description,
    imageThumbnailId: row.image_thumbnail_id,
    defaultOrder: row.default_order,
    technologyIds: techRows.map(t => t.technology_id),
  };
}

export function updateProject(id: string, project: Partial<Omit<Project, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (project.name !== undefined) { fields.push('name = ?'); values.push(project.name); }
  if (project.date !== undefined) { fields.push('date = ?'); values.push(project.date.toISOString()); }
  if (project.shortDescription !== undefined) { fields.push('short_description = ?'); values.push(project.shortDescription); }
  if (project.description !== undefined) { fields.push('description = ?'); values.push(project.description); }
  if (project.imageThumbnailId !== undefined) { fields.push('image_thumbnail_id = ?'); values.push(project.imageThumbnailId); }
  if (project.defaultOrder !== undefined) { fields.push('default_order = ?'); values.push(project.defaultOrder); }

  if (fields.length > 0) {
    values.push(id);
    database.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }

  // Update technology associations if provided
  if (project.technologyIds !== undefined) {
    database.prepare('DELETE FROM project_technologies WHERE project_id = ?').run(id);
    const stmt = database.prepare('INSERT INTO project_technologies (project_id, technology_id) VALUES (?, ?)');
    for (const techId of project.technologyIds) {
      stmt.run(id, techId);
    }
  }
}

export function deleteProject(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

// ==================== IMAGES ====================

export function createImage(image: Omit<Image, 'id'>): Image {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    `INSERT INTO images (id, description, size, base64_content, project_id, order_index)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, image.description, image.size, image.base64Content, image.projectId, image.order);
  return { id, ...image };
}

export function getImagesByProjectId(projectId: string): Image[] {
  const database = getDb();
  const rows = database.prepare(
    'SELECT * FROM images WHERE project_id = ? ORDER BY order_index'
  ).all(projectId) as any[];
  return rows.map(row => ({
    id: row.id,
    description: row.description,
    size: row.size,
    base64Content: row.base64_content,
    projectId: row.project_id,
    order: row.order_index,
  }));
}

export function getImageById(id: string): Image | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM images WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    description: row.description,
    size: row.size,
    base64Content: row.base64_content,
    projectId: row.project_id,
    order: row.order_index,
  };
}

export function updateImage(id: string, image: Partial<Omit<Image, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (image.description !== undefined) { fields.push('description = ?'); values.push(image.description); }
  if (image.size !== undefined) { fields.push('size = ?'); values.push(image.size); }
  if (image.base64Content !== undefined) { fields.push('base64_content = ?'); values.push(image.base64Content); }
  if (image.projectId !== undefined) { fields.push('project_id = ?'); values.push(image.projectId); }
  if (image.order !== undefined) { fields.push('order_index = ?'); values.push(image.order); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE images SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteImage(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM images WHERE id = ?').run(id);
}

// ==================== CERTIFICATIONS ====================

export function createCertification(cert: Omit<Certification, 'id'>): Certification {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    `INSERT INTO certifications (id, name, vendor, description, link_to_site, date_earned)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, cert.name, cert.vendor, cert.description, cert.linkToSite, cert.dateEarned.toISOString());
  return { id, ...cert };
}

export function getCertifications(): Certification[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM certifications ORDER BY date_earned DESC').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    vendor: row.vendor,
    description: row.description,
    linkToSite: row.link_to_site,
    dateEarned: new Date(row.date_earned),
  }));
}

export function getCertificationById(id: string): Certification | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM certifications WHERE id = ?').get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    vendor: row.vendor,
    description: row.description,
    linkToSite: row.link_to_site,
    dateEarned: new Date(row.date_earned),
  };
}

export function updateCertification(id: string, cert: Partial<Omit<Certification, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (cert.name !== undefined) { fields.push('name = ?'); values.push(cert.name); }
  if (cert.vendor !== undefined) { fields.push('vendor = ?'); values.push(cert.vendor); }
  if (cert.description !== undefined) { fields.push('description = ?'); values.push(cert.description); }
  if (cert.linkToSite !== undefined) { fields.push('link_to_site = ?'); values.push(cert.linkToSite); }
  if (cert.dateEarned !== undefined) { fields.push('date_earned = ?'); values.push(cert.dateEarned.toISOString()); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE certifications SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteCertification(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM certifications WHERE id = ?').run(id);
}

// ==================== SKILL TOPICS ====================

export function createSkillTopic(topic: Omit<SkillTopic, 'id'>): SkillTopic {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO skill_topics (id, name, order_index) VALUES (?, ?, ?)'
  ).run(id, topic.name, topic.order);
  return { id, ...topic };
}

export function getSkillTopics(): SkillTopic[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM skill_topics ORDER BY order_index').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    order: row.order_index,
  }));
}

export function updateSkillTopic(id: string, topic: Partial<Omit<SkillTopic, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (topic.name !== undefined) { fields.push('name = ?'); values.push(topic.name); }
  if (topic.order !== undefined) { fields.push('order_index = ?'); values.push(topic.order); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE skill_topics SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteSkillTopic(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM skill_topics WHERE id = ?').run(id);
}

// ==================== SKILL ITEMS ====================

export function createSkillItem(item: Omit<SkillItem, 'id'>): SkillItem {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO skill_items (id, description, skill_topic_id, order_index) VALUES (?, ?, ?, ?)'
  ).run(id, item.description, item.skillTopicId, item.order);
  return { id, ...item };
}

export function getSkillItems(): SkillItem[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM skill_items ORDER BY skill_topic_id, order_index').all() as any[];
  return rows.map(row => ({
    id: row.id,
    description: row.description,
    skillTopicId: row.skill_topic_id,
    order: row.order_index,
  }));
}

export function getSkillItemsByTopicId(topicId: string): SkillItem[] {
  const database = getDb();
  const rows = database.prepare(
    'SELECT * FROM skill_items WHERE skill_topic_id = ? ORDER BY order_index'
  ).all(topicId) as any[];
  return rows.map(row => ({
    id: row.id,
    description: row.description,
    skillTopicId: row.skill_topic_id,
    order: row.order_index,
  }));
}

export function updateSkillItem(id: string, item: Partial<Omit<SkillItem, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (item.description !== undefined) { fields.push('description = ?'); values.push(item.description); }
  if (item.skillTopicId !== undefined) { fields.push('skill_topic_id = ?'); values.push(item.skillTopicId); }
  if (item.order !== undefined) { fields.push('order_index = ?'); values.push(item.order); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE skill_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteSkillItem(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM skill_items WHERE id = ?').run(id);
}

// ==================== INTERESTS ====================

export function createInterest(interest: Omit<Interest, 'id'>): Interest {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    'INSERT INTO interests (id, name, order_index) VALUES (?, ?, ?)'
  ).run(id, interest.name, interest.order);
  return { id, ...interest };
}

export function getInterests(): Interest[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM interests ORDER BY order_index').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    order: row.order_index,
  }));
}

export function updateInterest(id: string, interest: Partial<Omit<Interest, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (interest.name !== undefined) { fields.push('name = ?'); values.push(interest.name); }
  if (interest.order !== undefined) { fields.push('order_index = ?'); values.push(interest.order); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE interests SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteInterest(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM interests WHERE id = ?').run(id);
}

// ==================== USER PROFILE ====================

export function createUserProfile(profile: Omit<UserProfile, 'id'>): UserProfile {
  const database = getDb();
  const id = crypto.randomUUID();
  database.prepare(
    `INSERT INTO user_profiles (id, name, email, summary, contact_email, phone_number, 
     profile_image_url, github_url, linkedin_url, youtube_url, facebook_url, twitter_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, profile.name, profile.email, profile.summary, profile.contactEmail, profile.phoneNumber,
     profile.profileImageUrl, profile.githubUrl, profile.linkedinUrl, profile.youtubeUrl,
     profile.facebookUrl, profile.twitterUrl);
  return { id, ...profile };
}

export function getUserProfile(): UserProfile | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM user_profiles LIMIT 1').get() as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    summary: row.summary,
    contactEmail: row.contact_email,
    phoneNumber: row.phone_number,
    profileImageUrl: row.profile_image_url,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    youtubeUrl: row.youtube_url,
    facebookUrl: row.facebook_url,
    twitterUrl: row.twitter_url,
  };
}

export function updateUserProfile(id: string, profile: Partial<Omit<UserProfile, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (profile.name !== undefined) { fields.push('name = ?'); values.push(profile.name); }
  if (profile.email !== undefined) { fields.push('email = ?'); values.push(profile.email); }
  if (profile.summary !== undefined) { fields.push('summary = ?'); values.push(profile.summary); }
  if (profile.contactEmail !== undefined) { fields.push('contact_email = ?'); values.push(profile.contactEmail); }
  if (profile.phoneNumber !== undefined) { fields.push('phone_number = ?'); values.push(profile.phoneNumber); }
  if (profile.profileImageUrl !== undefined) { fields.push('profile_image_url = ?'); values.push(profile.profileImageUrl); }
  if (profile.githubUrl !== undefined) { fields.push('github_url = ?'); values.push(profile.githubUrl); }
  if (profile.linkedinUrl !== undefined) { fields.push('linkedin_url = ?'); values.push(profile.linkedinUrl); }
  if (profile.youtubeUrl !== undefined) { fields.push('youtube_url = ?'); values.push(profile.youtubeUrl); }
  if (profile.facebookUrl !== undefined) { fields.push('facebook_url = ?'); values.push(profile.facebookUrl); }
  if (profile.twitterUrl !== undefined) { fields.push('twitter_url = ?'); values.push(profile.twitterUrl); }

  if (fields.length === 0) return;

  values.push(id);
  database.prepare(`UPDATE user_profiles SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

export function deleteUserProfile(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM user_profiles WHERE id = ?').run(id);
}

// ==================== JOB APPLICATIONS ====================

export function createJobApplication(app: Omit<JobApplication, 'id'>): JobApplication {
  const database = getDb();
  const id = crypto.randomUUID();
  
  database.prepare(
    `INSERT INTO job_applications (id, company_name, position_title, email, phone_number, location,
     city, state, job_description, salary, personal_notes, ranking, link_to_application, date_applied,
     custom_url, welcome_note, status, resume_generated, resume_template_id, portfolio_generated,
     url_welcome_active, url_resume_active, url_portfolio_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, app.companyName, app.positionTitle, app.email || '', app.phoneNumber || '', app.location, app.city || '',
     app.state || '', app.jobDescription || '', app.salary || '', app.personalNotes || '', app.ranking || 0, app.linkToApplication || '',
     app.dateApplied, app.customUrl || '', app.welcomeNote || '', app.status, app.resumeGenerated ? 1 : 0,
     app.resumeTemplateId || '', app.portfolioGenerated ? 1 : 0, app.urlsActive.welcome ? 1 : 0,
     app.urlsActive.resume ? 1 : 0, app.urlsActive.portfolio ? 1 : 0);

  // Add associations
  if (app.resumeWorkExperienceIds && app.resumeWorkExperienceIds.length > 0) {
    const stmt = database.prepare('INSERT INTO job_application_resume_work_experience (job_application_id, work_experience_id) VALUES (?, ?)');
    for (const weId of app.resumeWorkExperienceIds) {
      stmt.run(id, weId);
    }
  }

  if (app.resumeCollegeIds && app.resumeCollegeIds.length > 0) {
    const stmt = database.prepare('INSERT INTO job_application_resume_college (job_application_id, college_id) VALUES (?, ?)');
    for (const collegeId of app.resumeCollegeIds) {
      stmt.run(id, collegeId);
    }
  }

  if (app.portfolioProjectIds && app.portfolioProjectIds.length > 0) {
    const stmt = database.prepare('INSERT INTO job_application_portfolio_project (job_application_id, project_id) VALUES (?, ?)');
    for (const projectId of app.portfolioProjectIds) {
      stmt.run(id, projectId);
    }
  }

  return { id, ...app };
}

export function getJobApplications(): JobApplication[] {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM job_applications ORDER BY date_applied DESC').all() as any[];
  
  const applications = rows.map((row) => {
    const weIds = database.prepare(
      'SELECT work_experience_id FROM job_application_resume_work_experience WHERE job_application_id = ?'
    ).all(row.id) as any[];
    const collegeIds = database.prepare(
      'SELECT college_id FROM job_application_resume_college WHERE job_application_id = ?'
    ).all(row.id) as any[];
    const projectIds = database.prepare(
      'SELECT project_id FROM job_application_portfolio_project WHERE job_application_id = ?'
    ).all(row.id) as any[];

    return {
      id: row.id,
      companyName: row.company_name,
      positionTitle: row.position_title,
      email: row.email,
      phoneNumber: row.phone_number,
      location: row.location,
      city: row.city,
      state: row.state,
      jobDescription: row.job_description,
      salary: row.salary,
      personalNotes: row.personal_notes,
      ranking: row.ranking,
      linkToApplication: row.link_to_application,
      dateApplied: row.date_applied,
      customUrl: row.custom_url,
      welcomeNote: row.welcome_note,
      status: row.status as JobApplication['status'],
      resumeGenerated: Boolean(row.resume_generated),
      resumeWorkExperienceIds: weIds.map(w => w.work_experience_id),
      resumeCollegeIds: collegeIds.map(c => c.college_id),
      resumeTemplateId: row.resume_template_id,
      portfolioGenerated: Boolean(row.portfolio_generated),
      portfolioProjectIds: projectIds.map(p => p.project_id),
      urlsActive: {
        welcome: Boolean(row.url_welcome_active),
        resume: Boolean(row.url_resume_active),
        portfolio: Boolean(row.url_portfolio_active),
      },
    };
  });

  return applications;
}

export function getJobApplicationById(id: string): JobApplication | null {
  const database = getDb();
  const row = database.prepare('SELECT * FROM job_applications WHERE id = ?').get(id) as any;
  if (!row) return null;

  const weIds = database.prepare(
    'SELECT work_experience_id FROM job_application_resume_work_experience WHERE job_application_id = ?'
  ).all(id) as any[];
  const collegeIds = database.prepare(
    'SELECT college_id FROM job_application_resume_college WHERE job_application_id = ?'
  ).all(id) as any[];
  const projectIds = database.prepare(
    'SELECT project_id FROM job_application_portfolio_project WHERE job_application_id = ?'
  ).all(id) as any[];

  return {
    id: row.id,
    companyName: row.company_name,
    positionTitle: row.position_title,
    email: row.email,
    phoneNumber: row.phone_number,
    location: row.location,
    city: row.city,
    state: row.state,
    jobDescription: row.job_description,
    salary: row.salary,
    personalNotes: row.personal_notes,
    ranking: row.ranking,
    linkToApplication: row.link_to_application,
    dateApplied: row.date_applied,
    customUrl: row.custom_url,
    welcomeNote: row.welcome_note,
    status: row.status as JobApplication['status'],
    resumeGenerated: Boolean(row.resume_generated),
    resumeWorkExperienceIds: weIds.map(w => w.work_experience_id),
    resumeCollegeIds: collegeIds.map(c => c.college_id),
    resumeTemplateId: row.resume_template_id,
    portfolioGenerated: Boolean(row.portfolio_generated),
    portfolioProjectIds: projectIds.map(p => p.project_id),
    urlsActive: {
      welcome: Boolean(row.url_welcome_active),
      resume: Boolean(row.url_resume_active),
      portfolio: Boolean(row.url_portfolio_active),
    },
  };
}

export function updateJobApplication(id: string, app: Partial<Omit<JobApplication, 'id'>>): void {
  const database = getDb();
  const fields: string[] = [];
  const values: any[] = [];

  if (app.companyName !== undefined) { fields.push('company_name = ?'); values.push(app.companyName); }
  if (app.positionTitle !== undefined) { fields.push('position_title = ?'); values.push(app.positionTitle); }
  if (app.email !== undefined) { fields.push('email = ?'); values.push(app.email); }
  if (app.phoneNumber !== undefined) { fields.push('phone_number = ?'); values.push(app.phoneNumber); }
  if (app.location !== undefined) { fields.push('location = ?'); values.push(app.location); }
  if (app.city !== undefined) { fields.push('city = ?'); values.push(app.city); }
  if (app.state !== undefined) { fields.push('state = ?'); values.push(app.state); }
  if (app.jobDescription !== undefined) { fields.push('job_description = ?'); values.push(app.jobDescription); }
  if (app.salary !== undefined) { fields.push('salary = ?'); values.push(app.salary); }
  if (app.personalNotes !== undefined) { fields.push('personal_notes = ?'); values.push(app.personalNotes); }
  if (app.ranking !== undefined) { fields.push('ranking = ?'); values.push(app.ranking); }
  if (app.linkToApplication !== undefined) { fields.push('link_to_application = ?'); values.push(app.linkToApplication); }
  if (app.dateApplied !== undefined) { fields.push('date_applied = ?'); values.push(app.dateApplied); }
  if (app.customUrl !== undefined) { fields.push('custom_url = ?'); values.push(app.customUrl); }
  if (app.welcomeNote !== undefined) { fields.push('welcome_note = ?'); values.push(app.welcomeNote); }
  if (app.status !== undefined) { fields.push('status = ?'); values.push(app.status); }
  if (app.resumeGenerated !== undefined) { fields.push('resume_generated = ?'); values.push(app.resumeGenerated ? 1 : 0); }
  if (app.resumeTemplateId !== undefined) { fields.push('resume_template_id = ?'); values.push(app.resumeTemplateId); }
  if (app.portfolioGenerated !== undefined) { fields.push('portfolio_generated = ?'); values.push(app.portfolioGenerated ? 1 : 0); }
  if (app.urlsActive?.welcome !== undefined) { fields.push('url_welcome_active = ?'); values.push(app.urlsActive.welcome ? 1 : 0); }
  if (app.urlsActive?.resume !== undefined) { fields.push('url_resume_active = ?'); values.push(app.urlsActive.resume ? 1 : 0); }
  if (app.urlsActive?.portfolio !== undefined) { fields.push('url_portfolio_active = ?'); values.push(app.urlsActive.portfolio ? 1 : 0); }

  if (fields.length > 0) {
    values.push(id);
    database.prepare(`UPDATE job_applications SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  }

  // Update associations if provided
  if (app.resumeWorkExperienceIds !== undefined) {
    database.prepare('DELETE FROM job_application_resume_work_experience WHERE job_application_id = ?').run(id);
    const stmt = database.prepare('INSERT INTO job_application_resume_work_experience (job_application_id, work_experience_id) VALUES (?, ?)');
    for (const weId of app.resumeWorkExperienceIds) {
      stmt.run(id, weId);
    }
  }

  if (app.resumeCollegeIds !== undefined) {
    database.prepare('DELETE FROM job_application_resume_college WHERE job_application_id = ?').run(id);
    const stmt = database.prepare('INSERT INTO job_application_resume_college (job_application_id, college_id) VALUES (?, ?)');
    for (const collegeId of app.resumeCollegeIds) {
      stmt.run(id, collegeId);
    }
  }

  if (app.portfolioProjectIds !== undefined) {
    database.prepare('DELETE FROM job_application_portfolio_project WHERE job_application_id = ?').run(id);
    const stmt = database.prepare('INSERT INTO job_application_portfolio_project (job_application_id, project_id) VALUES (?, ?)');
    for (const projectId of app.portfolioProjectIds) {
      stmt.run(id, projectId);
    }
  }
}

export function deleteJobApplication(id: string): void {
  const database = getDb();
  database.prepare('DELETE FROM job_applications WHERE id = ?').run(id);
}

// Export the database instance getter for advanced usage
export { getDb };
