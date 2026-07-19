import { eventHandler, type H3Event, HTTPError } from 'h3';

export default eventHandler((event: H3Event) => {
    const method: string = event.req.method;
    const path: string = event.req.url;
    const endpoints = ['login', 'register', 'logout', 'token/revoke', 'token/validate'];

    const allowedMethods: string[] = ['POST', 'OPTIONS'];
    const existingPath: string[] = endpoints.map(endpoint => `/auth/${endpoint}`);

    if (existingPath.some(p => path.startsWith(p)) && !allowedMethods.includes(method)) {
        throw new HTTPError({ 
            statusCode: 405, 
            statusMessage: 'Method Not Allowed' 
        });
    }
});
