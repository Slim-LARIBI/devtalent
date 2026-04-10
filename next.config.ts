import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true, // ✅ déplacé hors experimental

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Required for UploadThing
  serverExternalPackages: ["@node-rs/argon2", "@node-rs/bcrypt"],
};

export default nextConfig;