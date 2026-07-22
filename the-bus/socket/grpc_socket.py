import asyncio
import json
import grpc
from grpc import aio
from grpc_reflection.v1alpha import reflection
from grpc_requests import Client

SERVICE_REGISTRY = {
    "identity": "localhost:5188",
    "order": "localhost:50053"
}

class BusRouterServicer:
    """
    Implements 'service BusRouter' dynamically.
    Matches the schema Node.js expects from your bus.proto file.
    """
    async def RouteEvent(self, request, context):
        try:
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
            return context.service_acceptor.response_marshal(
                success=True,
                message="Routed successfully",
                metadata=json.dumps(raw_response)
            )

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