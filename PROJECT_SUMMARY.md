# Project Summary

## What This Project Does

This is a **Static Website Generator** that creates personalized portfolio websites tailored for different job applications. Each company gets its own unique URL with customized content pulled from JSON data files.

## Key Features

✅ **Multiple Company Profiles** - Create unlimited company-specific versions of your portfolio  
✅ **4 Page Template** - Landing page, Resume, Portfolio, and Contact pages  
✅ **Unique URLs** - Each company has its own URL path (e.g., `/tesla/resume/`)  
✅ **Special Default Handling** - "default" company uses root URLs (no company name)  
✅ **Fully Static** - All pages are pre-rendered as static HTML  
✅ **Auto-Deploy** - GitHub Actions automatically deploys to GitHub Pages  
✅ **Beautiful UI** - Modern, responsive design with dark mode support  

## How It Works

### 1. Data Structure
```
data/companies/
├── default.json    # Your general portfolio (domain.com/)
├── tesla.json      # Tesla-specific version (domain.com/tesla/)
└── apple.json      # Apple-specific version (domain.com/apple/)
```

### 2. URL Routing
- **Default company** (`default.json`):
  - `/` - Landing page
  - `/resume/` - Resume
  - `/portfolio/` - Portfolio
  - `/contact/` - Contact

- **Other companies** (e.g., `tesla.json`):
  - `/tesla/resume/` - Resume
  - `/tesla/portfolio/` - Portfolio
  - `/tesla/contact/` - Contact

### 3. Build Process
1. Next.js reads all JSON files from `data/companies/`
2. For each company, it generates static HTML pages
3. The `out/` directory contains all pre-rendered pages
4. GitHub Pages serves the static files

### 4. Deployment Flow
```
Add/Update JSON → Git Push → GitHub Actions → Build Site → Deploy to Pages
```

## Technologies

- **Next.js 14** - React framework with static site generation
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **GitHub Actions** - Automated CI/CD
- **GitHub Pages** - Free static hosting

## Project Structure

```
static-website-generator-2/
│
├── app/                          # Next.js app directory (routes)
│   ├── page.tsx                  # Landing page (default company)
│   ├── resume/page.tsx           # Resume (default company)
│   ├── portfolio/page.tsx        # Portfolio (default company)
│   ├── contact/page.tsx          # Contact (default company)
│   ├── [company]/                # Dynamic company routes
│   │   ├── layout.tsx            # Company layout + static params
│   │   ├── resume/page.tsx       # Resume (company-specific)
│   │   ├── portfolio/page.tsx    # Portfolio (company-specific)
│   │   └── contact/page.tsx      # Contact (company-specific)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── header.tsx                # Navigation header
│   ├── footer.tsx                # Site footer
│   ├── portfolio-section.tsx    # Project showcase
│   ├── theme-toggle.tsx          # Dark/light mode toggle
│   └── ui/                       # shadcn/ui components
│
├── data/
│   └── companies/                # JSON data files
│       ├── default.json          # Default portfolio data
│       └── tesla.json            # Tesla-specific data
│
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   ├── data-loader.ts            # JSON data loading utilities
│   └── utils.ts                  # Helper functions
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions workflow
│
├── scripts/
│   ├── add-company.sh            # Bash script to add new company
│   └── add-company.bat           # Windows batch script
│
├── next.config.js                # Next.js config (enables static export)
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── package.json                  # Dependencies and scripts
│
├── README.md                     # Comprehensive documentation
├── SETUP.md                      # Quick start guide
└── PROJECT_SUMMARY.md            # This file
```

## Use Case Example

You're applying to multiple companies and want to tailor your portfolio for each:

1. **General Portfolio** (`default.json`)
   - Generic professional summary
   - All your projects
   - Complete work history
   - Share at: `yourdomain.com/`

2. **Tesla Application** (`tesla.json`)
   - Summary highlighting sustainable tech experience
   - Featured projects: IoT energy monitor, EV charging app
   - Work experiences emphasizing relevant skills
   - Share at: `yourdomain.com/tesla/resume/`

3. **Apple Application** (`apple.json`)
   - Summary focusing on UI/UX and design
   - Featured projects: Mobile apps, design systems
   - Work experiences highlighting Apple-relevant tech
   - Share at: `yourdomain.com/apple/resume/`

Each company sees a tailored version of your portfolio optimized for their job posting!

## Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Generate static site

# Add new company
./scripts/add-company.sh apple    # Linux/Mac
scripts\add-company.bat apple     # Windows

# Deploy
git add .
git commit -m "Add apple application"
git push              # Auto-deploys via GitHub Actions
```

## Why This Approach?

### ✅ Advantages
- **No Database** - Everything is in JSON files (easy to version control)
- **Fast Loading** - Pre-rendered static HTML is incredibly fast
- **Free Hosting** - GitHub Pages is free for public repos
- **Version Control** - Track changes to each company's portfolio
- **Easy Updates** - Just edit JSON and push
- **SEO Friendly** - Static pages are great for SEO
- **No Server Costs** - Pure static hosting

### 💡 Perfect For
- Job seekers applying to multiple companies
- Freelancers with different client portfolios
- Anyone wanting personalized portfolio versions
- Students applying to different programs

## Data Schema

Each JSON file contains:
- `userProfile` - Name, contact info, summary
- `colleges` - Education history
- `employers` & `positions` - Work history
- `workExperiences` - Detailed job responsibilities
- `skillTopics` & `skillItems` - Organized skills
- `technologies` - Tech stack
- `projects` - Portfolio projects
- `images` - Project images
- `certifications` - Professional certifications

See `lib/types.ts` for complete TypeScript definitions.

## Customization

The template is fully customizable:
- **Styling**: Edit `app/globals.css` and `tailwind.config.ts`
- **Layout**: Modify components in `components/`
- **Pages**: Update page structures in `app/`
- **Theme**: Change colors via CSS variables in `globals.css`

## Deployment

### GitHub Pages (Default)
1. Push code to GitHub
2. Enable GitHub Pages with GitHub Actions source
3. Automatic deployment on every push to `main`

### Other Platforms
The `out/` folder can be deployed to:
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

## Future Enhancements

Possible additions:
- Admin dashboard for managing JSON data
- Email integration for contact forms
- Analytics integration
- PDF generation for resumes
- Blog section
- Testimonials section

## License

MIT - Feel free to use for your job search!

---

**Happy job hunting! 🚀**
