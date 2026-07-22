import path from "node:path";
import { loadPackageDefinition } from "@grpc/grpc-js";
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

const grpcObject = loadPackageDefinition(packageDefinition);

// Target address of your Python Bus
const PYTHON_BUS_URL = process.env.PYTHON_BUS_URL || 'localhost:50051';

// Create and export the client instance
const busClient = new grpcObject.bus.BusService(
  PYTHON_BUS_URL,
  grpc.credentials.createInsecure() // Use createSsl() for production
);

export default busClient;