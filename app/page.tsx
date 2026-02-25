import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { GitHubImage } from "@/components/github-image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Code,
  Briefcase,
  DraftingCompass,
} from "lucide-react";
import PortfolioSection from "@/components/portfolio-section";
import ScrollingBanner from "@/components/scrolling-banner";
import { CompanyAwareLink } from "@/components/company-aware-link";

import type {
  Skill,
  UserProfile,
  Project,
  Image as ProjectImage,
} from "@/lib/types";

// Import default company data (will be loaded at build time)
import defaultCompanyData from "@/data/companies/default.json";

export default function Home() {
  const data = defaultCompanyData;
  const skills = data?.skills || [];
  const userProfile = data?.userProfile;

  // Combine skills at build time
  const allSkills = new Set<string>();
  skills.forEach((item) => allSkills.add(item.description));
  const shuffledSkills = Array.from(allSkills);

  const heroImage = {
    id: "hero-image",
    description: "Professional headshot for hero section",
    imageUrl:
      // use the image in the public folder for faster loading and to avoid hitting GitHub API limits during development
      "/images/image.jpg",
    imageHint: "professional portrait",
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative w-full text-primary-foreground hero-padding"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <div className="flex h-full flex-col md:flex-row">
          {/* Left column: desktop only (text + buttons) */}
          <div className="hidden md:flex md:flex-1 items-center">
            <div className="container px-4 md:px-6 text-left">
              <h1 className="text-foreground dark:text-primary-foreground text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {userProfile?.name || "Your Name"}
              </h1>
              <p className="mt-4 max-w-[700px] text-lg md:text-xl text-muted-foreground">
                {userProfile?.summary ||
                  "Innovative Full-Stack Developer | Building Scalable Web Solutions"}
              </p>
              <div className="mt-8 flex flex-col justify-start gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <CompanyAwareLink href="/resume">
                    View Resume <ArrowRight className="ml-2 h-5 w-5" />
                  </CompanyAwareLink>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <CompanyAwareLink href="/portfolio">
                    See Projects
                  </CompanyAwareLink>
                </Button>
              </div>
            </div>
          </div>

          {/* Right column: image (covers full hero height) */}
          <div className="relative w-full md:w-[600px] h-64 md:h-full overflow-hidden">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                style={{ objectPosition: "center -100px" }}
                priority
              />
            )}

            {/* Gradient for contrast on the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />

            {/* Mobile overlay: name near top, summary lower with translucent box */}
            <div className="md:hidden relative z-10">
              <div className="absolute top-6 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded px-3 py-2">
                  <h1 className="text-foreground dark:text-primary-foreground text-2xl font-headline font-extrabold tracking-tight">
                    {userProfile?.name || "Your Name"}
                  </h1>
                </div>
              </div>

              <div className="absolute left-4 right-4 bottom-28">
                <div className="bg-black/50 backdrop-blur-sm rounded p-4">
                  <p className="text-sm md:text-base text-white/90">
                    {userProfile?.summary ||
                      "Innovative Full-Stack Developer | Building Scalable Web Solutions"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile buttons: placed below the image */}
        <div className="md:hidden container mx-auto px-4 mt-4 flex flex-col items-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full max-w-md"
          >
            <CompanyAwareLink href="/resume">
              View Resume <ArrowRight className="ml-2 h-5 w-5" />
            </CompanyAwareLink>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="w-full max-w-md"
          >
            <CompanyAwareLink href="/portfolio">See Projects</CompanyAwareLink>
          </Button>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-stretch gap-12 md:flex-row md:justify-between md:items-start md:flex-nowrap">
            {[
              {
                icon: <Star className="h-8 w-8 text-accent" />,
                title: "Leadership & Innovation",
                description:
                  "Led a team of 5 engineers to deliver a flagship product, increasing user engagement by 40%.",
              },
              {
                icon: <Briefcase className="h-8 w-8 text-accent" />,
                title: "Full-Stack Expertise",
                description:
                  "Developed and maintained scalable full-stack applications with millions of users.",
              },
              {
                icon: <DraftingCompass className="h-8 w-8 text-accent" />,
                title: "Performance Optimization",
                description:
                  "Reduced API response times by 60% and improved frontend load times by 2x.",
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
          <div className="container mx-auto px-4 pt-10 pb-5 sm:px-6 lg:px-8">
            <PortfolioSection
              projects={data?.projects?.slice(0, 3)}
              skills={data?.skills}
              images={data?.images}
            />
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <CompanyAwareLink href="/portfolio">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </CompanyAwareLink>
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
              Skills
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              I have experience with a modern tech stack for building
              high-quality software.
            </p>
          </div>
          {shuffledSkills.length > 0 ? (
            <div className="mt-12">
              <ScrollingBanner speed={30} pauseOnHover={false}>
                {shuffledSkills.map((skill, index) => (
                  <Badge
                    key={`${skill}-${index}`}
                    variant="secondary"
                    className="px-4 py-2 text-sm whitespace-nowrap flex-shrink-0"
                  >
                    {skill}
                  </Badge>
                ))}
              </ScrollingBanner>
            </div>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                No skills have been added yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Get in Touch Section with short message and a button to redirect to the contact page */}
      <section className="relative bg-muted py-16 sm:py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Professional business person in modern office setting"
          fill
          className="object-cover grayscale"
          data-ai-hint="professional portrait or business setting"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center text-white">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Work With Me
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-white/90 md:text-xl/relaxed">
              Interested in having me on your team? Let&apos;s connect to
              schedule a chat.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-1 bg-white text-black hover:bg-primary hover:text-white"
              >
                <CompanyAwareLink href="/contact">
                  Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                </CompanyAwareLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
