# Static Website Generator

A Next.js-based static website generator that creates personalized portfolio websites for different companies from JSON data files.

## Features

- 🎨 Beautiful, responsive portfolio template with 4 pages:
  - Landing Page
  - Resume
  - Portfolio
  - Contact
- 📄 JSON-based data management for each company
- 🔗 Unique URLs for each company (e.g., `domain.com/tesla/resume`)
- 🌐 Automatic deployment to GitHub Pages
- 🎯 Special handling for "default" company (no company name in URL)

## Project Structure

```
├── app/                           # Next.js app directory
│   ├── page.tsx                   # Landing page (default company)
│   ├── resume/page.tsx            # Resume page (default company)
│   ├── portfolio/page.tsx         # Portfolio page (default company)
│   ├── contact/page.tsx           # Contact page (default company)
│   └── [company]/                 # Dynamic company routes
│       ├── resume/page.tsx        # Company-specific resume
│       ├── portfolio/page.tsx     # Company-specific portfolio
│       └── contact/page.tsx       # Company-specific contact
├── data/
│   └── companies/                 # JSON data files for each company
│       ├── default.json           # Default company data
│       └── tesla.json             # Tesla-specific data
├── lib/
│   ├── types.ts                   # TypeScript type definitions
│   └── data-loader.ts             # Utility to load company data
├── components/                    # React components
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions deployment workflow
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Company Data

Create a new JSON file in `data/companies/` for each company. Use the existing files as templates:

- `data/companies/default.json` - Your default portfolio (accessible at root URLs)
- `data/companies/tesla.json` - Example company-specific data

### 3. JSON Data Schema

Each company JSON file should follow this structure (see `lib/types.ts` for complete schema):

```json
{
  "companyName": "tesla",
  "userProfile": {
    "name": "Your Name",
    "email": "your@email.com",
    "summary": "Tailored summary for this company...",
    "contactEmail": "your@email.com",
    "phoneNumber": "(555) 123-4567",
    "githubUrl": "https://github.com/yourusername",
    "linkedinUrl": "https://linkedin.com/in/yourusername"
  },
  "colleges": [...],
  "employers": [...],
  "positions": [...],
  "workExperiences": [...],
  "skillTopics": [...],
  "skillItems": [...],
  "technologies": [...],
  "projects": [...],
  "images": [
    {
      "id": "img1",
      "description": "Project Screenshot",
      "imageUrl": "https://images.unsplash.com/photo-xxxxx",
      "projectId": "1",
      "order": 1
    }
  ],
  "certifications": [...]
}
```

### 4. Image Handling

You have three options for project images:

**Option 1: External URLs (Recommended)**
```json
{
  "imageUrl": "https://images.unsplash.com/photo-xxxxx"
}
```

**Option 2: Local Images**
Place images in `public/images/` and reference as:
```json
{
  "imageUrl": "/images/project-screenshot.png"
}
```

**Option 3: Base64 (Not Recommended)**
```json
{
  "base64Content": "data:image/png;base64,..."
}
```

See [data/images/README.md](data/images/README.md) for detailed image handling guide.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Build Static Site

Generate static HTML files:

```bash
npm run build
```

The static site will be generated in the `out/` directory.

## URL Structure

- **Default Company (e.g., "default"):**
  - Landing: `domain.com/`
  - Resume: `domain.com/resume/`
  - Portfolio: `domain.com/portfolio/`
  - Contact: `domain.com/contact/`

- **Other Companies (e.g., "tesla"):**
  - Resume: `domain.com/tesla/resume/`
  - Portfolio: `domain.com/tesla/portfolio/`
  - Contact: `domain.com/tesla/contact/`

## Deployment to GitHub Pages

This project includes automatic deployment to GitHub Pages via GitHub Actions.

### Setup Instructions

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to **Pages** section
   - Under **Source**, select **GitHub Actions**

3. **Automatic Deployment:**
   - Every push to the `main` branch will trigger the deployment workflow
   - Your site will be available at `https://yourusername.github.io/your-repo/`

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings with your domain provider
3. Enable custom domain in GitHub Pages settings

## Adding New Companies

1. Create a new JSON file in `data/companies/`:
   ```bash
   cp data/companies/tesla.json data/companies/newcompany.json
   ```

2. Update the data in the new JSON file

3. Build the site:
   ```bash
   npm run build
   ```

4. The new company pages will be automatically generated at:
   - `domain.com/newcompany/resume/`
   - `domain.com/newcompany/portfolio/`
   - `domain.com/newcompany/contact/`

## Customization

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Theme: Uses shadcn/ui components with customizable themes

### Components

Reusable UI components are in the `components/` directory:
- `header.tsx` - Navigation header
- `footer.tsx` - Site footer
- `portfolio-section.tsx` - Project showcase
- `ui/` - shadcn/ui components

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
