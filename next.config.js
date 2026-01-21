/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Ensures proper routing for GitHub Pages
  // basePath: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: process.env.GITHUB_ACTIONS ? '/my-website' : '',
}

module.exports = nextConfig
