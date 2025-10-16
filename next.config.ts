import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // İyzipay paketinin resources klasörünü ignore et
      config.externals = config.externals || [];
      config.externals.push({
        'iyzipay': 'commonjs iyzipay'
      });
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['iyzipay'],
  },
};

export default nextConfig;
