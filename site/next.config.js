/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
  },
}

module.exports = nextConfig