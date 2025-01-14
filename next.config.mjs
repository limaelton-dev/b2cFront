/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
        removeConsole: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.portalcoletek.com.br',
                port: '',
                pathname: '/Imagens/**',
            },
        ],
    },
};

export default nextConfig;
