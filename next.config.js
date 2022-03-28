/** @type {import('next').NextConfig} */
const { uri } = require('./env.json');

const nextConfig = {
    reactStrictMode: true,
    env: {
        uri: uri
    }
}

module.exports = nextConfig
