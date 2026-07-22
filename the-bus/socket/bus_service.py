import asyncio
import json
import logging
import grpc

import bus_pb2
import bus_pb2_grpc

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. Inherit from the generated Servicer base class
class BusService(bus_pb2_grpc.BusServiceServicer):
    
    # 2. Implement the RPC method defined in .proto
    async def DispatchRequest(
        self, request: bus_pb2.BusPayload, context: grpc.aio.ServicerContext
    ) -> bus_pb2.BusResponse:
        
        logger.info(f"Received Action: {request.action}")
        payload_data = json.loads(request.payload_json) if request.payload_json else {}

        # Route logic based on action
        if request.action == "GET_USER_DETAILS":
            user_id = payload_data.get("user_id")
            
            # Simulated business logic / microservice delegation
            result = {
                "id": user_id,
                "name": "Alice Developer",
                "role": "Admin",
                "status": "Active"
            }
            
            return bus_pb2.BusResponse(
                status_code=200,
                result_json=json.dumps(result)
            )

        # Handle unknown actions
        return bus_pb2.BusResponse(
            status_code=404,
            result_json=json.dumps({"error": f"Unknown action: {request.action}"})
        )

