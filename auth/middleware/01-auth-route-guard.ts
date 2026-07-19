import { defineEventHandler, proxy, type H3Event } from 'h3'

// server/middleware/auth-method-guard.ts
export default defineEventHandler((event: H3Event) => {
    const url = event.req.url;
    const method = event.req.method;

    const strictAuthPaths = [
        '/auth/login',
        '/auth/logout',
        '/auth/register',
        '/auth/token/validate',
        '/auth/token/revoke'
    ]

    if (strictAuthPaths.includes(url)) {
        if (method !== 'POST' && method !== 'OPTIONS') {
            return proxy(event, '/auth/_errors/405-not-allowed')
        }
    } else {
        return proxy(event, '/auth/_errors/404-not-found')
    }

    return;
});
