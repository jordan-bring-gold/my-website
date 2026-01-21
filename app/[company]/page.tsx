import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Code, Briefcase, DraftingCompass } from 'lucide-react';
import PortfolioSection from '@/components/portfolio-section';
import { loadCompanyData, getCompanyNames } from '@/lib/data-loader';

import type { Technology, SkillItem, UserProfile, Project, Image as ProjectImage } from '@/lib/types';

// Generate static paths for all companies
export async function generateStaticParams() {
  const companies = getCompanyNames();
  return companies
    .filter(company => company !== 'default')
    .map((company) => ({
      company: company,
    }));
}

interface CompanyHomeProps {
  params: {
    company: string;
  };
}

export default function CompanyHome({ params }: CompanyHomeProps) {
  const companyData = loadCompanyData(params.company);
  
  if (!companyData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Company Not Found</h2>
          <p className="text-muted-foreground mt-2">No data available for this company.</p>
        </div>
      </div>
    );
  }

  const data = companyData;
  const technologies = data?.technologies || [];
  const skillItems = data?.skillItems || [];
  const userProfile = data?.userProfile;

  // Combine and shuffle skills at build time
  const allSkills = new Set<string>();
  technologies.forEach(tech => allSkills.add(tech.name));
  skillItems.forEach(item => allSkills.add(item.description));
  const shuffledSkills = Array.from(allSkills);
  
  const heroImage = {
      "id": "hero-image",
      "description": "Professional headshot for hero section",
      "imageUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjczMzk1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "professional portrait"
    };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full text-primary-foreground">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {userProfile?.name || 'Your Name'}
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg md:text-xl">
              {userProfile?.summary || 'Innovative Full-Stack Developer | Building Scalable Web Solutions'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/${params.company}/resume`}>
                  View Resume <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/${params.company}/portfolio`}>See Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-background py-16 sm:py-24">
  <div className="container mx-auto px-4 md:px-6">
    <div className="flex flex-col items-stretch gap-12 md:flex-row md:justify-between md:items-start md:flex-nowrap">
      {[
        {
          icon: <Star className="h-8 w-8 text-accent" />,
          title: 'Leadership & Innovation',
          description:
            'Led a team of 5 engineers to deliver a flagship product, increasing user engagement by 40%.',
        },
        {
          icon: <Briefcase className="h-8 w-8 text-accent" />,
          title: 'Full-Stack Expertise',
          description:
            'Developed and maintained scalable full-stack applications with millions of users.',
        },
        {
          icon: <DraftingCompass className="h-8 w-8 text-accent" />,
          title: 'Performance Optimization',
          description:
            'Reduced API response times by 60% and improved frontend load times by 2x.',
        },
      ].map((highlight, index) => (
        <div
          key={index}
          className="
            flex flex-col items-center text-center
            md:items-center md:text-center
            md:flex-1 md:max-w-[340px]
          "
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            {highlight.icon}
          </div>
          <h3 className="text-xl font-bold">{highlight.title}</h3>
          <p className="mt-2 text-muted-foreground">
            {highlight.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>




      {/* Featured Projects Section */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
             <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Projects
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              A selection of my recent work.
            </p>
          </div>
          <div  className="container mx-auto px-4 pt-10 pb-5 sm:px-6 lg:px-8">
            <PortfolioSection projects={data?.projects} technologies={data?.technologies} images={data?.images} />
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href={`/${params.company}/portfolio`}>View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <Code className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Technologies & Skills
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              I have experience with a modern tech stack for building high-quality software.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {shuffledSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                {skill}
              </Badge>
            ))}
             {shuffledSkills.length === 0 && (
                <p className="text-muted-foreground">No skills or technologies have been added yet.</p>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
