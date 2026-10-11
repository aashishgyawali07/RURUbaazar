/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Hosts next/image may load from. Add your Supabase Storage host when you serve real product images.
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co' }],
  },
};

export default nextConfig;