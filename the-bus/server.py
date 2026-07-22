import asyncio
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from grpc_requests import Client
import grpc

from pydantic import BaseModel

SERVICE_REGISTRY = {
    "identity": "localhost:50052",
    "order": "localhost:50053"
}

# Request schema received from NitroTS
class DynamicEventPayload(BaseModel):
    service_alias: str    # e.g., "identity"
    grpc_service: str     # Full proto service name, e.g., "identity.Identity"
    method_name: str      # RPC method name, e.g., "SayHello"
    payload: dict         # Method parameters as dictionary, e.g., {"name": "Alice"}

app = FastAPI()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket, client_id: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message from {client_id}: {data}")
        
@app.post("/api/dispatch")
async def dispatch_event(data: DynamicEventPayload):
    # 1. Look up address by service alias
    target_address = SERVICE_REGISTRY.get(data.service_alias)
    if not target_address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{data.service_alias}' is not registered on the bus."
        )

    try:
        # 2. Connect to C# service and fetch protobuf schema via Reflection
        client = Client.get_by_endpoint(target_address)

        # 3. Dynamically invoke the RPC method passing the dict payload directly
        response = client.request(
            service_name=data.grpc_service,
            method_name=data.method_name,
            data=data.payload
        )

        return {
            "success": True,
            "data": response
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Dynamic gRPC call failed: {str(e)}"
        )
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)