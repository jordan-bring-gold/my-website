const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

async function generateResumePDFs() {
  const dataDir = path.join(__dirname, "..", "data", "companies");
  const publicDir = path.join(__dirname, "..", "public");

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Register Handlebars helpers (same logic as client-side)
  Handlebars.registerHelper("formatDate", function (date) {
    if (!date) return "";
    const str = String(date);
    const parts = str.split("-");
    if (parts.length === 3) {
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
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  });

  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const companyData = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), "utf-8"),
    );

    if (!companyData.resumeTemplate) {
      console.log(`Skipping ${file} - no resumeTemplate`);
      continue;
    }

    console.log(`Generating PDF for: ${file}`);

    const compiled = Handlebars.compile(companyData.resumeTemplate);
    const html = compiled(companyData);

    const page = await browser.newPage();

    // Set content and wait for all network requests (including Google Fonts) to finish
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Extra wait to ensure fonts are fully rendered
    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const name =
      companyData.userProfile?.name?.replace(/\s+/g, "_") || "Resume";
    const companyName = companyData.companyName || "default";
    const suffix = companyName === "default" ? "" : `_${companyName}`;
    const outputPath = path.join(publicDir, `${name}_Resume${suffix}.pdf`);

    await page.pdf({
      path: outputPath,
      format: "letter",
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: false,
      // Let the HTML template's own padding/margins handle spacing
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    await page.close();
    console.log(
      `  Done: ${path.relative(path.join(__dirname, ".."), outputPath)}`,
    );
  }

  await browser.close();
  console.log("\nAll resume PDFs generated successfully!");
}

generateResumePDFs().catch((err) => {
  console.error("Failed to generate resume PDFs:", err);
  process.exit(1);
});
