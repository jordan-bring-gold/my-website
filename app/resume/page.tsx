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

      // --- Font & style debugging: inspect what's in the iframe head ---
      const iframeHeadLinks = Array.from(
        iframeDoc.head.querySelectorAll('link[rel="stylesheet"]'),
      );
      console.log(
        "Stylesheet <link> tags in iframe head:",
        iframeHeadLinks.map((l) => l.getAttribute("href")),
      );
      const iframeHeadStyles = Array.from(
        iframeDoc.head.querySelectorAll("style"),
      );
      console.log(
        "Inline <style> tags in iframe head:",
        iframeHeadStyles.length,
      );

      // Extract <style> tags from head and inline them into body for html2canvas
      // html2canvas only captures body content, not head styles
      // NOTE: <link> stylesheet tags stay in <head> — they don't work inside <div> in body
      const headStyles = iframeHeadStyles
        .map((style) => style.outerHTML)
        .join("\n");

      // Prepend extracted <style> content directly into the body (not wrapped in a div)
      // so html2canvas can see the CSS rules
      const styleContainer = iframeDoc.createElement("div");
      styleContainer.style.display = "none";
      styleContainer.innerHTML = headStyles;
      iframeDoc.body.insertBefore(styleContainer, iframeDoc.body.firstChild);

      console.log("Styles injected into body");

      // --- Wait for the Google Fonts stylesheet to actually load ---
      // The <link> in iframe head triggers a network fetch; we need to wait for it
      const fontLoadStart = Date.now();

      // First wait for any stylesheet link to load
      if (iframeHeadLinks.length > 0) {
        console.log("Waiting for stylesheet links to load...");
        await Promise.all(
          iframeHeadLinks.map(
            (link) =>
              new Promise<void>((resolve) => {
                // If already loaded, resolve immediately
                const el = link as HTMLLinkElement;
                if (el.sheet) {
                  console.log(`Stylesheet already loaded: ${el.href}`);
                  resolve();
                  return;
                }
                el.addEventListener("load", () => {
                  console.log(`Stylesheet loaded: ${el.href}`);
                  resolve();
                });
                el.addEventListener("error", () => {
                  console.warn(`Stylesheet failed to load: ${el.href}`);
                  resolve();
                });
                // Timeout fallback
                setTimeout(() => {
                  console.warn(`Stylesheet load timeout: ${el.href}`);
                  resolve();
                }, 5000);
              }),
          ),
        );
      }

      // Now wait for font faces to be ready
      if (iframeDoc.fonts) {
        console.log("Waiting for document.fonts.ready...");
        await iframeDoc.fonts.ready;

        // Log all loaded fonts
        const loadedFonts: string[] = [];
        iframeDoc.fonts.forEach((font: FontFace) => {
          loadedFonts.push(
            `${font.family} (weight: ${font.weight}, status: ${font.status})`,
          );
        });
        console.log("Fonts in iframe after ready:", loadedFonts);

        // Explicitly try to load Roboto as a test
        try {
          await iframeDoc.fonts.load('400 12px "Roboto"');
          console.log("Roboto 400 font load check: success");
        } catch (e) {
          console.warn("Roboto 400 font load check: failed", e);
        }

        // Log final font state
        const finalFonts: string[] = [];
        iframeDoc.fonts.forEach((font: FontFace) => {
          finalFonts.push(
            `${font.family} (weight: ${font.weight}, status: ${font.status})`,
          );
        });
        console.log("Final fonts in iframe:", finalFonts);
      }

      const fontLoadTime = Date.now() - fontLoadStart;
      console.log(`Font loading took ${fontLoadTime}ms`);

      // Extra buffer for rendering
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // --- Debug: check computed font on a visible element ---
      const firstH1 = iframeDoc.querySelector("h1");
      if (firstH1) {
        const computed = iframe.contentWindow?.getComputedStyle(firstH1);
        console.log("Computed font-family on <h1>:", computed?.fontFamily);
        console.log("Computed font-size on <h1>:", computed?.fontSize);
      }
      const firstBody = iframeDoc.body;
      const bodyComputed = iframe.contentWindow?.getComputedStyle(firstBody);
      console.log("Computed font-family on <body>:", bodyComputed?.fontFamily);
      console.log("Computed display on <body>:", bodyComputed?.display);

      // Get the body element from the iframe
      const iframeBody = iframeDoc.body;
      console.log("Iframe body height:", iframeBody.scrollHeight);
      console.log("Iframe body width:", iframeBody.scrollWidth);

      // Configure PDF options - use the iframe's window as context for html2canvas
      const opt = {
        margin: [-0.2, 0.0, 0.0, 0.0] as [number, number, number, number],
        filename:
          `${userProfile?.name?.replace(/\s+/g, "_")}_Resume.pdf` ||
          "Resume.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
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
          unit: "in" as const,
          format: "letter" as const,
          orientation: "portrait" as const,
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
