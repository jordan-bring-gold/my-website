# Quick Setup Guide

Follow these steps to get your static website generator up and running.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Test Locally

Start the development server to see your site:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Test different company pages:
- Default: http://localhost:3000/
- Tesla: http://localhost:3000/tesla/resume/

## Step 3: Customize Your Data

### Edit Default Company Data

Edit `data/companies/default.json` with your information:

```json
{
  "companyName": "default",
  "userProfile": {
    "name": "Your Name",
    "email": "your@email.com",
    "summary": "Your professional summary...",
    ...
  },
  ...
}
```

### Add New Company Data

1. Copy the template:
   ```bash
   cp data/companies/tesla.json data/companies/apple.json
   ```

2. Edit the new file and change:
   - `companyName` to "apple"
   - Customize the summary, projects, and experiences for Apple
   - Tailor work experiences and projects to match the job posting

3. The new pages will be automatically available at:
   - `/apple/resume/`
   - `/apple/portfolio/`
   - `/apple/contact/`

## Step 4: Build Static Site

Generate the static HTML files:

```bash
npm run build
```

The static site will be created in the `out/` directory.

## Step 5: Deploy to GitHub Pages

### Initial Setup

1. Create a new GitHub repository

2. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

4. The site will automatically deploy on every push to `main` branch

### View Your Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## URL Structure Explained

### For "default" Company
- Landing: `yourdomain.com/`
- Resume: `yourdomain.com/resume/`
- Portfolio: `yourdomain.com/portfolio/`
- Contact: `yourdomain.com/contact/`

### For Other Companies (e.g., "tesla", "apple")
- Resume: `yourdomain.com/tesla/resume/`
- Portfolio: `yourdomain.com/tesla/portfolio/`
- Contact: `yourdomain.com/tesla/contact/`

## Workflow for Each Job Application

1. **Create company JSON file:**
   ```bash
   cp data/companies/default.json data/companies/companyname.json
   ```

2. **Customize the data:**
   - Update the summary to match the job description
   - Highlight relevant projects
   - Emphasize matching skills and experiences
   - Add any company-specific details

3. **Test locally:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/companyname/resume/
   ```

4. **Deploy:**
   ```bash
   git add data/companies/companyname.json
   git commit -m "Add companyname application"
   git push
   ```

5. **Share the URL:**
   Send the recruiter: `yourdomain.com/companyname/resume/`

## Tips

- Keep `default.json` as your general portfolio
- Create a new JSON file for each job application
- Customize work experience descriptions to match job requirements
- Update projects to show relevant skills for each company
- The contact form will work once you set up the email API (optional)

## Troubleshooting

### Build Errors

If you get build errors, make sure:
- All JSON files are valid (no trailing commas)
- All required fields are present
- Date strings are in ISO format: "YYYY-MM-DD"

### Pages Not Generating

- Check that JSON filename matches the company name in the file
- Ensure the file is in `data/companies/` directory
- Run `npm run build` to regenerate

### GitHub Pages Not Updating

- Check the **Actions** tab in your repository for build status
- Make sure GitHub Pages is set to deploy from **GitHub Actions**
- Wait 2-3 minutes after pushing for deployment to complete

## Next Steps

1. Customize the styling in `app/globals.css`
2. Update the header name in `components/header.tsx`
3. Add your own images (update image URLs in JSON files)
4. Set up custom domain (optional)
5. Configure email form backend (optional)

Need help? Check the main README.md for more details!
