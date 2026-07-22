import path from "node:path";
import { loadPackageDefinition, credentials, type ServiceClientConstructor } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Path to your .proto file
const PROTO_PATH = path.resolve(process.cwd(), "protos/bus.proto");

const packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const busService = loadPackageDefinition(packageDefinition);

// Target address of your Python Bus
const PYTHON_BUS_URL = process.env.PYTHON_BUS_URL || 'localhost:8000';

const busPackage = busService.bus as { BusRouter: ServiceClientConstructor }; // Adjust this based on your proto package structure
const BusRouterConstructor = busPackage.BusRouter;

// 2. Instantiate the actual client instance using 'new'
const busClient = new BusRouterConstructor(
    PYTHON_BUS_URL,
    credentials.createInsecure() 
);

export default busClient;

