
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Linkedin, Youtube, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { XIcon } from './icons/x-icon';
import * as React from 'react';

// Import default company data for footer
import defaultCompanyData from '@/data/companies/default.json';

export default function Footer() {
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();
  
  // Use default company data for footer
  const userProfile = defaultCompanyData?.userProfile;

  const socialLinks = [
    {
      name: 'GitHub',
      url: userProfile?.githubUrl,
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: 'LinkedIn',
      url: userProfile?.linkedinUrl,
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      name: 'YouTube',
      url: userProfile?.youtubeUrl,
      icon: <Youtube className="h-5 w-5" />,
    },
    {
      name: 'Facebook',
      url: userProfile?.facebookUrl,
      icon: <Facebook className="h-5 w-5" />,
    },
    {
      name: 'X',
      url: userProfile?.twitterUrl,
      icon: <XIcon className="h-5 w-5" />,
    },
  ];
  
  

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row md:px-6">
        <p className="text-sm">
          © {new Date().getFullYear()} {userProfile?.name || 'Jordan Bringgold'}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {socialLinks.map((social) =>
              social.url ? (
                <Button variant="ghost" size="icon" asChild key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                </Button>
              ) : null
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
