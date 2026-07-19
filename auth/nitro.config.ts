import { defineConfig } from "nitro"

export default defineConfig({
    serverDir: "./server",
    routes: {
        "/auth/**": "./server/api/**"
    },
    
    devProxy: {
        "/auth/**": {
            target: `http://${process.env.HOST_ADDRESS || "localhost"}:${process.env.SERVICE_PORT || 4000}`,
            changeOrigin: true
        }
    },
    routeRules: {
        "/auth/**": {
            cors: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }
        }
    },
    runtimeConfig: {
        jweSecret: process.env.JWE_SECRET || 'your-secret-key',
        public: {
            redisHost: process.env.REDIS_HOST || 'localhost',
            redisPort: process.env.REDIS_PORT || 6379,
            service_port: process.env.SERVICE_PORT || 4000,
            hostname: process.env.HOST_ADDRESS || "localhost",   
        }
    }
});
