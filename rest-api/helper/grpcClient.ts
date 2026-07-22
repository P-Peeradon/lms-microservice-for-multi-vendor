import path from "node:path";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Path to your .proto file
const PROTO_PATH = path.resolve(process.cwd(), "protos/identity.proto");

const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const busService = loadPackageDefinition(packageDefinition) as any;

// Target address of your Python Bus
const PYTHON_BUS_URL = process.env.PYTHON_BUS_URL || 'localhost:50051';

// Create and export the client instance
const busClient = new busService.bus.BusRouter(
  PYTHON_BUS_URL,
  credentials.createInsecure() // Use createSsl() for production
);

export default busClient;

/**
 export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Promisify gRPC call for async/await in Nitro
  const sendToBus = (requestData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      pythonBusClient.ProcessEvent(requestData, (err: any, response: any) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  };

  try {
    const grpcResponse = await sendToBus({
      event_name: body.event_name,
      payload: JSON.stringify(body.data || {}),
    });

    return {
      status: 'success',
      data: grpcResponse,
    };
  } catch (err: any) {
    setResponseStatus(event, 502);
    return {
      status: 'error',
      message: 'Failed to communicate with Python Bus',
      details: err.message,
    };
  }
});
 */