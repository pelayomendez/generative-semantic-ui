/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@generative-semantic-ui/core",
    "@generative-semantic-ui/html",
    "@generative-semantic-ui/shadcn",
  ],
};

export default nextConfig;
