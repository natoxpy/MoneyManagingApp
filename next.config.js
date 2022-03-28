/** @type {import('next').NextConfig} */

let fileEnv = {};

// Development
if (false) {
    fileEnv = require('./env.json')
}

const nextConfig = {
    reactStrictMode: true,
    env: {
        uri: fileEnv.URI || process.env.URI
    }
}

module.exports = nextConfig
