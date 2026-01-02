/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // output: "export", // Disabled to allow dynamic routes for [slug] pages
    images: {
        unoptimized: true, // Required for static export
    }
};

module.exports = nextConfig;
