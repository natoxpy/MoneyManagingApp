/** @type {import('next').NextConfig} */
const fileEnv = require('./env.json') || {};

const nextConfig = {
    reactStrictMode: true,
    env: {
        uri: fileEnv.URI || process.env.URI
    }
}

module.exports = nextConfig
