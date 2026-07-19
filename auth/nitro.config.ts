import { defineConfig } from "nitro"

export default defineConfig({
  serverDir: './server',
  runtimeConfig: {
    url: `https://${process.env.APP_DOMAIN}/auth`,
  }
});
