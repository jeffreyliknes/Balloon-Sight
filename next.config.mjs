/** @type {import('next').NextConfig} */
const nextConfig = {
    generateBuildId() {
        return 'build-' + Date.now();
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000']
        }
    }
};

export default nextConfig;

