import { defineConfig } from "nitro"

export default defineConfig({
    serverDir: './server',
    database: {
        default: {
            connector: 'mysql2',
            options: {
                host: process.env.DB_HOST ?? 'localhost',
                port: Number(process.env.DB_PORT) ?? 3306,
                user: process.env.DB_USER ?? 'root',
                password: process.env.DB_PASSWORD ?? 'root',
                database: process.env.DB_NAME ?? 'lms-lumiere-carnet'
            }
        }
    }
});
