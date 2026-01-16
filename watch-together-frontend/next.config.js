/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for simple-peer SSR issues
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('simple-peer');
    }
    return config;
  },
}

module.exports = nextConfig
