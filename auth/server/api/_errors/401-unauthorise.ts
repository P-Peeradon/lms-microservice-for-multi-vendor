import { eventHandler, type H3Event, HTTPError } from 'h3';

export default eventHandler((event: H3Event) => {
    // 1. When the token does not exist.
    const auth = event.req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
        throw new HTTPError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Missing Authorization header.'
        });
    }

    // 2. When the token is invalid.
    const token = auth.split(' ')[1];
    if (!token || token !== 'valid-token') {
        throw new HTTPError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Invalid token.'
        });
    }
});