/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Ensures proper routing for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig
