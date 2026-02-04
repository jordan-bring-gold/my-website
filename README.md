# Static Website Generator

A Next.js-based static website generator that creates personalized portfolio websites from JSON data files.

## Features

- Beautiful, responsive portfolio template with 4 pages:
  - Landing Page
  - Resume
  - Portfolio
  - Contact
- JSON-based data management for updating the site info

- Automatic deployment to GitHub Pages

## Getting Started

### 1. Install Dependencies

```bash
npm install
npm ci --legacy-peer-deps
```

### 2. Add  Data

Use the existing files as templates:

- `data/companies/default.json` - Your default portfolio 

### 3. JSON Data Schema

Each company JSON file should follow this structure (see `lib/types.ts` for complete schema):

### 4. Image Handling

**External URLs (Recommended)**
```json
{
  "imageUrl": "https://images.unsplash.com/photo-xxxxx"
}
```

Run the development server:

```bash
npm run dev
```

### 5. Build Static Site

Generate static HTML files:

```bash
npm run build
```

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

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

use "npx serve out" to localhost out static files
