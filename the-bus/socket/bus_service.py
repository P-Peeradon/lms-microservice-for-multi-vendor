import concurrent.futures
import grpc
import logging
import bus_pb2
import bus_pb2_grpc

# Register available downstream microservices (can be loaded from env/config/Kubernetes DNS)
SERVICE_REGISTRY = {
    "order_service": "localhost:50052",    # C# ASP.NET Microservice
    "payment_service": "localhost:50053",  # Go/Python/Java Service
    "user_service": "localhost:50054",     # Node.js/Other Service
}

class ServiceChannelManager:
    """Manages reusable gRPC channels and stubs to avoid opening/closing sockets constantly."""
    def __init__(self, registry):
        self._stubs = {}
        for service_name, address in registry.items():
            # Create persistent channel for each registered service
            channel = grpc.insecure_channel(address)
            self._stubs[service_name] = bus_pb2_grpc.BusRouterStub(channel)

    def get_stub(self, service_name):
        return self._stubs.get(service_name)

class DynamicBusRouter(bus_pb2_grpc.BusRouterServicer):
    def __init__(self, channel_manager):
        self.manager = channel_manager

    def RouteEvent(self, request, context):
        target = request.target_service
        print(f"[Python Bus Router] Routing event '{request.event_name}' -> Target: '{target}'")

        # 1. Look up destination service stub
        stub = self.manager.get_stub(target)

        if not stub:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"Target service '{target}' is not registered on the bus.")
            return bus_pb2.BusResponse(
                success=False, 
                message=f"Unknown target service: {target}"
            )

        # 2. Forward request directly to target microservice
        try:
            # Forward the request (or modify metadata/headers if needed)
            response = stub.RouteEvent(request)
            return response

        except grpc.RpcError as e:
            print(f"[Python Bus Router Error] Failed to reach {target}: {e.details()}")
            context.set_code(grpc.StatusCode.UNAVAILABLE)
            context.set_details(f"Downstream service '{target}' error: {e.details()}")
            return bus_pb2.BusResponse(
                success=False, 
                message=f"Service '{target}' unavailable"
            )
