import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    serverActions: {} // biarin kosong kalau nggak mau set opsi
  }
};

export default nextConfig;
