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
            {
                protocol: 'http',
                hostname: 'www.portalcoletek.com.br',
                port: '',
                pathname: '/imagens/**',
            },
            {
                protocol: 'https',
                hostname: 'coletek.eccosys.com.br',
                port: '',
                pathname: '/anexos/produtos/imagens/**',
            },
        ],
    },
};

export default nextConfig;
