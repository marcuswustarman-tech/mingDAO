import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 启用静态导出
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 移除或注释掉serverExternalPackages
  // serverExternalPackages: ['binance-api-node'],
};

export default nextConfig;
