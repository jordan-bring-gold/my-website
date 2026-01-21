import PortfolioSection from '@/components/portfolio-section'
import type { Project, Technology, Image as ProjectImage } from '@/lib/types';

interface PortfolioPageProps {
    data?: {
        projects?: Project[];
        technologies?: Technology[];
        images?: ProjectImage[];
    };
}

export default function PortfolioPage({ data }: PortfolioPageProps) {
    return (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-extrabold tracking-tight lg:text-5xl">My Portfolio</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                    A collection of projects I've worked on.
                </p>
            </div>
            
            <PortfolioSection projects={data?.projects} technologies={data?.technologies} images={data?.images} />
        </div>
    )
}
