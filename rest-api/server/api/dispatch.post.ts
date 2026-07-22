import busClient from '~/helper/grpcClient';
import { readBody, defineEventHandler, type H3Event, HTTPError } from 'h3';

interface GrpcRequest {
    target_service: string; // e.g., "order_service", "payment_service"
    event_name: string;     // e.g., "CreateOrder", "ProcessPayment"
    payload: object | string;        // JSON or serialized data
}

// Promisify gRPC call for async/await in Nitro
const sendToBus = (requestData: GrpcRequest): Promise<any> => {
    return new Promise((resolve, reject) => {
        busClient.RouteEvent(requestData, (err: any, response: any) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
};

export default defineEventHandler(async (event: H3Event) => {
    const body: GrpcRequest | undefined = await readBody(event);

    if (!body || !body.target_service || !body.event_name) {
        throw new HTTPError({
            statusCode: 400, 
            statusMessage: 'Invalid request body. Required fields: target_service, event_name'
        });
    }

    try {
        
        const grpcResponse = await sendToBus({
            target_service: body.target_service,
            event_name: body.event_name,
            payload: typeof body.payload === 'object' ? JSON.stringify(body.payload) : (body.payload || "{}"),
        });

        return {
            status: 'success',
            data: grpcResponse,
        };
    } catch (err: any) {
        console.error("⛔ Real Internal gRPC Failure:", err);

        throw new HTTPError({
            statusCode: 502, 
            statusMessage: 'Failed to communicate with Python Bus'
        });
    }
});