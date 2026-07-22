import path from "node:path";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Path to your .proto file
const PROTO_PATH = path.resolve(process.cwd(), "protos/identity.proto");