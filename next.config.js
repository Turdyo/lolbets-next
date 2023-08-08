/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "cdn.pandascore.co"
            },
            {
                hostname: "cdn.discordapp.com"
            }
        ]
    }
}

module.exports = nextConfig
