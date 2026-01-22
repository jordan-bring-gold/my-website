
import { Github, Linkedin, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadCompanyData, getCompanyNames } from '@/lib/data-loader';

// Generate static paths for all companies
export async function generateStaticParams() {
  const companies = getCompanyNames();
  return companies
    .filter(company => company !== 'default')
    .map((company) => ({
      company: company,
    }));
}

interface ContactPageProps {
    params: Promise<{
        company: string;
    }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { company } = await params;
    const companyData = loadCompanyData(company);
    const userProfile = companyData?.userProfile;

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
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

         
                    <div>
                        <h1 className="text-4xl font-headline font-extrabold tracking-tight lg:text-5xl">Get in Touch</h1>
                        <p className="mt-4 text-xl text-muted-foreground">
                        I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of an ambitious vision.
                    </p>
                    <div className="mt-8 space-y-4">
                        {userProfile?.contactEmail && (
                            <a href={`mailto:${userProfile.contactEmail}`} className="flex items-center gap-4 text-lg group">
                                <Mail className="h-6 w-6 text-primary" />
                                <span className="group-hover:text-primary transition-colors">{userProfile.contactEmail}</span>
                            </a>
                        )}
                        {userProfile?.githubUrl && (
                            <a href={userProfile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg group">
                                <Github className="h-6 w-6 text-primary" />
                                <span className="group-hover:text-primary transition-colors">GitHub</span>
                            </a>
                        )}
                        {userProfile?.linkedinUrl && (
                            <a href={userProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg group">
                                <Linkedin className="h-6 w-6 text-primary" />
                                <span className="group-hover:text-primary transition-colors">LinkedIn</span>
                            </a>
                        )}
                    </div>
                    
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Reach Out via Email</CardTitle>
                            <CardDescription>Click the button below to send me an email directly.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Email me at {userProfile?.contactEmail || 'contact@email.com'} for project inquiries, collaboration opportunities, or any questions you may have.
                                </p>
                                {userProfile?.contactEmail && (
                                    <Button asChild className="w-full">
                                        <a href={`mailto:${userProfile.contactEmail}`}>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Email
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

