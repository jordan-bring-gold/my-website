"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Phone, Linkedin, Github } from "lucide-react";

// Import default company data
import defaultCompanyData from "@/data/companies/default.json";

const formatDate = (date: any) => {
  if (!date) return "";

  // Parse date string to avoid timezone issues
  // If date is a string like "2024-01-01", parse it as local time not UTC
  if (typeof date === "string") {
    const parts = date.split("-");
    if (parts.length === 3) {
      // Create date in local timezone: year, month (0-indexed), day
      const jsDate = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2]),
      );
      return jsDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  }

  const jsDate = date instanceof Date ? date : new Date(date);
  return jsDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function ResumePage() {
  const companyData = defaultCompanyData;
  const userProfile = companyData?.userProfile || null;
  const workExperiences = companyData?.workExperiences || [];
  const positions = companyData?.positions || [];
  const employers = companyData?.employers || [];
  const colleges = companyData?.colleges || [];
  const skills = companyData?.skills || [];
  const certifications = companyData?.certifications || [];

  const pdfUrl = `/${userProfile?.name?.replace(/\s+/g, "_")}_Resume.pdf`;

  const sortedPositions = positions
    ? [...positions].sort((a: any, b: any) => {
        const dateA =
          a.dateStarted instanceof Date
            ? a.dateStarted.getTime()
            : new Date(a.dateStarted).getTime();
        const dateB =
          b.dateStarted instanceof Date
            ? b.dateStarted.getTime()
            : new Date(b.dateStarted).getTime();
        return dateB - dateA;
      })
    : [];

  if (!userProfile) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Resume Not Available</h2>
          <p className="text-muted-foreground mt-2">No resume data provided.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-headline font-bold">
              {userProfile?.name}
            </h1>
            <p className="mt-1 text-xl text-muted-foreground">
              Full-Stack Developer
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" asChild>
            <a href={pdfUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>

        <div className="select-none" onContextMenu={(e) => e.preventDefault()}>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
            {userProfile?.contactEmail && (
              <a
                href={`mailto:${userProfile.contactEmail}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Mail className="h-4 w-4" /> {userProfile.contactEmail}
              </a>
            )}
            {userProfile?.phoneNumber && (
              <a
                href={`tel:${userProfile.phoneNumber}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone className="h-4 w-4" /> {userProfile.phoneNumber}
              </a>
            )}
            {userProfile?.linkedinUrl && (
              <a
                href={userProfile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {userProfile?.githubUrl && (
              <a
                href={userProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>

          {/*userProfile?.summary && (
                    <section>
                        <h2 className="text-2xl font-headline font-semibold border-b pb-2">Summary</h2>
                        <p className="mt-4 text-foreground/90 whitespace-pre-wrap">
                           {userProfile.summary}
                        </p>
                    </section>
                )*/}

          {/*<Separator className="my-8" />*/}

          <section>
            <h2 className="text-2xl font-headline font-semibold border-b pb-2">
              Work Experience
            </h2>
            <div className="mt-4 space-y-6">
              {sortedPositions?.map((pos: any) => {
                const employer = employers?.find(
                  (e: any) => e.id === pos.employerId,
                );
                const experiences = workExperiences?.filter(
                  (we: any) => we.positionId === pos.id,
                );
                return (
                  <div key={pos.id}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                      <h3 className="text-lg font-semibold">{pos.name}</h3>
                      <p className="text-sm text-muted-foreground sm:order-2">
                        {formatDate(pos.dateStarted)} -{" "}
                        {pos.dateFinished
                          ? formatDate(pos.dateFinished)
                          : "Present"}
                      </p>
                    </div>
                    <p className="text-md text-foreground/90">
                      {employer?.name} | {employer?.city}, {employer?.state}
                    </p>
                    <ul className="mt-2 ml-5 list-disc list-outside space-y-1 text-foreground/90">
                      {experiences?.map((exp: any) => (
                        <li key={exp.id}>{exp.description}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <Separator className="my-8" />

          <section>
            <h2 className="text-2xl font-headline font-semibold border-b pb-2">
              Education
            </h2>
            <div className="mt-4 space-y-4">
              {colleges?.map((college: any) => (
                <div key={college.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                    <h3 className="text-lg font-semibold">{college.name}</h3>
                    <p className="text-sm text-muted-foreground order-3 sm:order-2">
                      {formatDate(college.dateStarted)} -{" "}
                      {formatDate(college.dateGraduated)}
                    </p>
                  </div>
                  <p className="text-md text-foreground/90">{college.degree}</p>
                  <p className="text-sm text-muted-foreground">
                    {college.city && college.state
                      ? `${college.city}, ${college.state}`
                      : college.city || college.state || ""}
                    {college.isOnline && ` (Online)`}
                  </p>
                  {/*<p className="text-sm text-muted-foreground">GPA: {college.gpa}</p>*/}
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          {certifications && certifications.length > 0 && (
            <>
              <section>
                <h2 className="text-2xl font-headline font-semibold border-b pb-2">
                  Certifications
                </h2>
                <div className="mt-4 space-y-3">
                  {certifications.map((cert: any) => (
                    <div key={cert.id}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                        <h3 className="text-lg font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground order-2">
                          {cert.dateEarned && formatDate(cert.dateEarned)}
                          {cert.dateEarned && cert.dateExpires && " - "}
                          {cert.dateExpires && formatDate(cert.dateExpires)}
                        </p>
                      </div>
                      {cert.vendor && (
                        <p className="text-md text-foreground/90">
                          {cert.vendor}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="my-8" />
            </>
          )}

          <section>
            <h2 className="text-2xl font-headline font-semibold border-b pb-2">
              Skills
            </h2>
            <p className="mt-4 text-foreground/90">
              {skills?.map((skill: any) => skill.description).join(", ")}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
