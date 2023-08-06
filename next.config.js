/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cdn.pandascore.co"
            }
        ]
    }
}

module.exports = nextConfig
