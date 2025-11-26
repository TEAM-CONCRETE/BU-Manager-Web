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
  webpack: (config, { isServer }) => {
    // react-pdf와 pdfjs-dist를 클라이언트 사이드에서만 번들링
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };

      // react-pdf 관련 모듈을 externals로 처리하지 않도록 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    } else {
      // 서버 사이드에서는 react-pdf를 externals로 처리
      config.externals = config.externals || [];
      config.externals.push({
        "react-pdf": "commonjs react-pdf",
        "pdfjs-dist": "commonjs pdfjs-dist",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
