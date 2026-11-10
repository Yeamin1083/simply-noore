/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// GitHub Pages repository basePath handling
// When deploying to GitHub Pages, the site is served from /simply-noore
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? '/simply-noore' : '');
const basePath = rawBasePath === '/' ? '' : rawBasePath.replace(/\/$/, '');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  basePath: basePath || undefined,
  // Ensures all NextJS assets map correctly on GitHub CDN
  assetPrefix: basePath ? `${basePath}/` : undefined,
  reactStrictMode: true,
};

export default nextConfig;
