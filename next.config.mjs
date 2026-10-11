// Fail loudly if the dev auth bypass flag leaks into a production build.
if (process.env.NODE_ENV === 'production' && process.env.DEV_BYPASS_AUTH === 'true') {
  throw new Error('DEV_BYPASS_AUTH must not be set in production.');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Hosts next/image may load from. Add your Supabase Storage host when you serve real product images.
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co' }],
  },
};
export default nextConfig;
