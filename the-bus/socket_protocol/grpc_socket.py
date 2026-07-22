import asyncio
import json
import grpc
from grpc import aio
from grpc_reflection.v1alpha import reflection
from grpc_requests import Client

from google.protobuf.descriptor_pb2 import FileDescriptorProto, DescriptorProto, FieldDescriptorProto
from google.protobuf import descriptor_pool, message_factory

file_desc = FileDescriptorProto(name="bus.proto", package="bus")

# Define BusRequest message
bus_request = DescriptorProto(name="BusRequest")
bus_request.field.append(FieldDescriptorProto(name="target_service", number=1, type=9))
bus_request.field.append(FieldDescriptorProto(name="event_name", number=2, type=9))
bus_request.field.append(FieldDescriptorProto(name="payload", number=3, type=9))
file_desc.message_type.append(bus_request)

# Define BusResponse message
bus_response = DescriptorProto(name="BusResponse")
bus_response.field.append(FieldDescriptorProto(name="success", number=1, type=8))
bus_response.field.append(FieldDescriptorProto(name="message", number=2, type=9))
bus_response.field.append(FieldDescriptorProto(name="metadata", number=3, type=9))
file_desc.message_type.append(bus_response)

pool = descriptor_pool.Default()
pool.Add(file_desc)

BusRequestMessage = message_factory.GetMessageClass(pool.FindMessageTypeByName('bus.BusRequest'))
BusResponseMessage = message_factory.GetMessageClass(pool.FindMessageTypeByName('bus.BusResponse'))

SERVICE_REGISTRY = {
    "identity": "localhost:5188",
    "order": "localhost:50053"
}

class BusRouterServicer:
    """
    Implements 'service BusRouter' dynamically.
    Matches the schema Node.js expects from your bus.proto file.
    """
    async def RouteEvent(self, raw_request_bytes, context):
        try:
            # Instantiate and parse raw request bytes
            request = BusRequestMessage()
            request.ParseFromString(raw_request_bytes)
            
            # Extract fields sent from your Node.js app
            target_service = request.target_service  # e.g., "identity"
            grpc_service = request.grpc_service      # e.g., "identity.Identity"
            event_name = request.event_name          # e.g., "SayHello"
            
            # Safely parse the incoming stringified JSON payload into a Python dict
            payload_dict = json.loads(request.payload) if request.payload else {}

            # Look up target downstream microservice
            target_address = SERVICE_REGISTRY.get(target_service)
            if not target_address:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details(f"Service '{target_service}' not registered.")
                return b"" 

            # Dynamically connect to C# backend via Reflection and invoke the method
            loop = asyncio.get_event_loop()
            client = Client.get_by_endpoint(target_address)
            
            raw_response = await loop.run_in_executor(
                None, 
                lambda: client.request(
                    service_name=grpc_service,
                    method_name=event_name,
                    data=payload_dict
                )
            )

            # Map the downstream dictionary response back to your BusResponse schema
            response = BusResponseMessage(
                success=True,
                message="Routed successfully",
                metadata=json.dumps(raw_response)
            )
            
            return response.SerializeToString()

        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Routing gateway crash: {str(e)}")
            return b""

class DynamicGrpcGateway(grpc.GenericRpcHandler):
    """
    Intercepts uncompiled requests and applies gRPC HTTP/2 compliance
    """
    def __init__(self):
        self.servicer = BusRouterServicer()

    def service(self, handler_call_details):
        # Intercepts incoming requests going to "/bus.BusRouter/RouteEvent"
        if handler_call_details.method == '/bus.BusRouter/RouteEvent':
            return grpc.unary_unary_rpc_method_handler(
                self.servicer.RouteEvent,
                request_deserializer=lambda x: x, 
                response_serializer=lambda x: x
            )
        return None