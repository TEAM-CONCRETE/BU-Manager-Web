const proxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, "") ?? null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!proxyTarget) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${proxyTarget}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
