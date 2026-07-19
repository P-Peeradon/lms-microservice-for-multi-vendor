import { connectRedis } from '../redis';
import * as jose from 'jose';
import type { JWEPayload } from './interface';

const JWE_SECRET: string = process.env.JWE_SECRET ?? 'default-secret-key';

async function generateJWEToken(payload: JWEPayload, secret: string): Promise<string> {
    // Implement your JWE token generation logic here
    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(new TextEncoder().encode(secret));

    return jwe; 
}

async function verifyJWEToken(token: string, secret: string): Promise<JWEPayload | null> {
    // Implement your JWE token verification logic here
    try {
        const { plaintext } = await jose.compactDecrypt(token, new TextEncoder().encode(secret));
        return JSON.parse(new TextDecoder().decode(plaintext));
    } catch {
        return null;
    }
}

function revokeJWEToken(token: string): boolean {
    // Implement your JWE token revocation logic here
    // For example, you can maintain a blacklist of revoked tokens
    return false; // Placeholder, replace with actual token revocation logic
}

const jweTokenHelper = {
    generateJWEToken,
    verifyJWEToken,
    revokeJWEToken
};

export default jweTokenHelper;