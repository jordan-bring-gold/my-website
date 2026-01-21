import PortfolioSection from '@/components/portfolio-section';
import { loadCompanyData, getCompanyNames } from '@/lib/data-loader';
import type { Project, Technology, Image as ProjectImage } from '@/lib/types';

// Generate static paths for all companies
export async function generateStaticParams() {
  const companies = getCompanyNames();
  return companies
    .filter(company => company !== 'default')
    .map((company) => ({
      company: company,
    }));
}

interface PortfolioPageProps {
    params: {
        company: string;
    };
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
    const companyData = loadCompanyData(params.company);
    
    if (!companyData) {
        return (
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Company Not Found</h2>
                    <p className="text-muted-foreground mt-2">No data available for this company.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-extrabold tracking-tight lg:text-5xl">My Portfolio</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                    A collection of projects I&apos;ve worked on.
                </p>
            </div>
            
            <PortfolioSection 
                projects={companyData?.projects} 
                technologies={companyData?.technologies} 
                images={companyData?.images} 
            />
        </div>
    )
}
