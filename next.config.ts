import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支持 middleware 和动态渲染
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 移除或注释掉serverExternalPackages
  // serverExternalPackages: ['binance-api-node'],
};

export default nextConfig;
