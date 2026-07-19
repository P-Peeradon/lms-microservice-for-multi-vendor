import { eventHandler, type H3Event, HTTPError } from 'h3';

export default eventHandler((event: H3Event) => {
    const path: string = event.req.url;
    const endpoints = ['login', 'register', 'logout', 'token/revoke', 'token/validate'];
    const existingPath: string[] = endpoints.map(endpoint => `/auth/${endpoint}`);

    if (!existingPath.some(p => path.startsWith(p))) {
        throw new HTTPError({ 
            statusCode: 404, 
            statusMessage: 'The requested endpoint was Not Found' 
        });
    }
});
