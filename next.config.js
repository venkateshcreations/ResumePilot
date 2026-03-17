/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/ResumePilot' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ResumePilot' : '',
};

module.exports = nextConfig;
