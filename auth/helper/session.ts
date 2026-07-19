import { redisClient } from '../redis';
import type { JWEPayload, University } from './interface';
import jweTokenHelper from './jweToken';

async function createSession(ShadowID: string, issuer: University, token: string, ipAddress: string, userAgent: string): Promise<void> {
    const sessionId = `session:${ShadowID}:${issuer}`;
    const payload: JWEPayload | null = await jweTokenHelper.verifyJWEToken(token, process.env.JWE_SECRET ?? 'default-secret-key');

    const sessionObject = {
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000, // Session expires in 8 hours
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        ...payload // Include other relevant payload data
    };
    
    await redisClient.set(sessionId, JSON.stringify(sessionObject), { 'EX': 8 * 60 * 60 }); // Set expiration to 8 hours
}

const sessionHelper = {
    createSession
};

export default sessionHelper;