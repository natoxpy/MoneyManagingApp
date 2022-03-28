/** @type {import('next').NextConfig} */
const { URI } = require('./env.json');

const nextConfig = {
    reactStrictMode: true,
    env: {
        uri: URI
    }
}

module.exports = nextConfig
