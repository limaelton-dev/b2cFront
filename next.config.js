/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desabilitado para evitar warnings do findDOMNode com react-input-mask
  images: {
    domains: ['www.portalcoletek.com.br', 'placehold.co', 'localhost', 'coletek.eccosys.com.br'],
  },
}

module.exports = nextConfig 