import { defineConfig } from "nitro"

export default defineConfig({
    serverDir: "./server",
    routes: {
        "/auth/**": "./server/api/**"
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
    }
});
