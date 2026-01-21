import fs from 'fs';
import path from 'path';

export interface CompanyData {
  companyName: string;
  userProfile?: any;
  colleges?: any[];
  employers?: any[];
  positions?: any[];
  workExperiences?: any[];
  skillTopics?: any[];
  skillItems?: any[];
  technologies?: any[];
  projects?: any[];
  images?: any[];
  certifications?: any[];
}

/**
 * Get all company names from JSON files in the data/companies directory
 */
export function getCompanyNames(): string[] {
  const dataDir = path.join(process.cwd(), 'data', 'companies');
  
  if (!fs.existsSync(dataDir)) {
    console.warn('Data directory not found:', dataDir);
    return [];
  }

  const files = fs.readdirSync(dataDir);
  const companyNames = files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  return companyNames;
}

/**
 * Load company data from JSON file
 */
export function loadCompanyData(companyName: string): CompanyData | null {
  const dataDir = path.join(process.cwd(), 'data', 'companies');
  const filePath = path.join(dataDir, `${companyName}.json`);

  if (!fs.existsSync(filePath)) {
    console.warn(`Company data file not found: ${filePath}`);
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Convert date strings to Date objects
    if (data.positions) {
      data.positions = data.positions.map((pos: any) => ({
        ...pos,
        dateStarted: pos.dateStarted ? new Date(pos.dateStarted) : null,
        dateFinished: pos.dateFinished ? new Date(pos.dateFinished) : null,
      }));
    }
    
    if (data.projects) {
      data.projects = data.projects.map((proj: any) => ({
        ...proj,
        date: proj.date ? new Date(proj.date) : null,
      }));
    }
    
    if (data.certifications) {
      data.certifications = data.certifications.map((cert: any) => ({
        ...cert,
        dateEarned: cert.dateEarned ? new Date(cert.dateEarned) : null,
      }));
    }
    
    return data;
  } catch (error) {
    console.error(`Error loading company data for ${companyName}:`, error);
    return null;
  }
}

/**
 * Get the default company name
 */
export function getDefaultCompanyName(): string {
  const companies = getCompanyNames();
  return companies.includes('default') ? 'default' : companies[0] || 'default';
}
