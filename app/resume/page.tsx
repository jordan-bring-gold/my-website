"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Phone, Linkedin, Github } from "lucide-react";
import * as React from "react";

import type {
  UserProfile,
  WorkExperience,
  Position,
  Employer,
  College,
  Skill,
  Certification,
} from "@/lib/types";

// Import default company data
import defaultCompanyData from "@/data/companies/default.json";

const formatDate = (date: any) => {
  if (!date) return "";
  const jsDate = date instanceof Date ? date : new Date(date);
  return jsDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function ResumePage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

  const companyData = defaultCompanyData;
  const userProfile = companyData?.userProfile || null;
  const workExperiences = companyData?.workExperiences || [];
  const positions = companyData?.positions || [];
  const employers = companyData?.employers || [];
  const colleges = companyData?.colleges || [];
  const skills = companyData?.skills || [];
  const certifications = companyData?.certifications || [];

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      const template = companyData.resumeTemplate;

      if (!template) {
        alert("Resume template not found");
        setIsGeneratingPDF(false);
        return;
      }

      console.log("Template loaded, length:", template.length);

      // Dynamically import html2pdf (browser-only)
      const html2pdf = (await import("html2pdf.js")).default;

      // Load Handlebars from CDN dynamically
      const loadHandlebars = (): Promise<any> => {
        return new Promise((resolve, reject) => {
          if ((window as any).Handlebars) {
            resolve((window as any).Handlebars);
            return;
          }

          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/handlebars@4.7.8/dist/handlebars.min.js";
          script.onload = () => resolve((window as any).Handlebars);
          script.onerror = reject;
          document.head.appendChild(script);
        });
      };

      // Load Handlebars
      const Handlebars = await loadHandlebars();
      console.log("Handlebars loaded");

      // Register helper functions
      Handlebars.registerHelper("formatDate", (date: any) => {
        if (!date) return "";
        const jsDate = date instanceof Date ? date : new Date(date);
        return jsDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      });

      Handlebars.registerHelper("eq", (a: any, b: any) => {
        return a === b;
      });

      console.log("Helpers registered");

      // Compile the template
      const compiledTemplate = Handlebars.compile(template);
      console.log("Template compiled");

      // Generate HTML with data
      const fullHtml = compiledTemplate(companyData);
      console.log("HTML generated, length:", fullHtml.length);

      // Create an iframe to render the complete HTML document
      // The iframe creates an isolated document context - no parent CSS will leak in
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.top = "-10000px"; // Position off-screen but keep visible for rendering
      iframe.style.left = "0";
      iframe.style.width = "850px";
      iframe.style.height = "1100px";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      // Write the complete HTML document to the iframe
      // This includes all styles from the resumeTemplate - completely isolated from parent page
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      iframeDoc.open();
      iframeDoc.write(fullHtml);
      iframeDoc.close();

      console.log("HTML written to iframe");

      // Extract styles from head and move them into body for html2canvas
      // html2canvas only captures body content, not head styles
      const headStyles = Array.from(iframeDoc.head.querySelectorAll("style"))
        .map((style) => style.outerHTML)
        .join("\n");

      // Create a wrapper div with all styles and CSS resets
      const wrapper = iframeDoc.createElement("div");
      wrapper.style.cssText = `
        all: initial;
        display: block;
        background: white;
        color: #333;
        font-family: inherit;
        line-height: inherit;
      `;
      wrapper.innerHTML = `
        ${headStyles}
        <style>
          /* CSS Reset to prevent parent page styles from leaking */
          * { all: revert; }
        </style>
        ${iframeDoc.body.innerHTML}
      `;

      // Replace body content with wrapped content
      iframeDoc.body.innerHTML = "";
      iframeDoc.body.style.cssText = `
        margin: 0;
        padding: 0;
        background: white;
        all: initial;
      `;
      iframeDoc.body.appendChild(wrapper);

      console.log("Styles moved to body and CSS resets applied");

      // Wait for iframe to fully render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the body element from the iframe
      const iframeBody = iframeDoc.body;
      console.log("Iframe body height:", iframeBody.scrollHeight);
      console.log("Iframe body width:", iframeBody.scrollWidth);

      // Configure PDF options - use the iframe's window as context for html2canvas
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename:
          `${userProfile?.name?.replace(/\s+/g, "_")}_Resume.pdf` ||
          "Resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true,
          windowWidth: iframeBody.scrollWidth,
          windowHeight: iframeBody.scrollHeight,
          // Use the iframe's window context so styles are included
          windowContext: iframe.contentWindow,
        },
        jsPDF: {
          unit: "in",
          format: "letter",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      console.log("Starting PDF generation...");
      await html2pdf().from(iframeBody).set(opt).save();
      console.log("PDF generated successfully");

      // Clean up
      document.body.removeChild(iframe);

      // Hide overlay with a slight delay for smooth transition
      setTimeout(() => setIsGeneratingPDF(false), 300);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
      setIsGeneratingPDF(false);
    }
  };

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
      {/* Loading overlay with fade transitions */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
          isGeneratingPDF ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-background rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg font-semibold">Generating PDF...</p>
          <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
      </div>

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
          <Button className="mt-4 sm:mt-0" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
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
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-semibold">{pos.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(pos.dateStarted)} -{" "}
                        {pos.dateFinished
                          ? formatDate(pos.dateFinished)
                          : "Present"}
                      </p>
                    </div>
                    <p className="text-md text-foreground/90">
                      {employer?.name} | {employer?.city}, {employer?.state}
                    </p>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/90">
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
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-semibold">{college.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {college.yearGraduated}
                    </p>
                  </div>
                  <p className="text-md text-foreground/90">{college.degree}</p>
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
                      <h3 className="text-lg font-semibold">{cert.name}</h3>
                      {cert.vendor && (
                        <p className="text-md text-foreground/90">
                          {cert.vendor}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {cert.dateEarned && (
                          <span>Earned: {formatDate(cert.dateEarned)}</span>
                        )}
                        {cert.dateEarned && cert.dateExpires && (
                          <span> | </span>
                        )}
                        {cert.dateExpires && (
                          <span>Expires: {formatDate(cert.dateExpires)}</span>
                        )}
                      </p>
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
