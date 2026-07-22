import asyncio

from fastapi import FastAPI, logger
from socket import bus_pb2_grpc, BusService
import grpc

app = FastAPI()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket, client_id: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message from {client_id}: {data}")
        
async def serve():
    server = grpc.aio.server()
    bus_pb2_grpc.add_BusServiceServicer_to_server(BusService(), server)
    
    # Listen on port 50051 (matches Nitro TS client config)
    listen_addr = "[::]:50051"
    server.add_insecure_port(listen_addr)
    
    logger.info(f"🚀 Python gRPC Bus listening on {listen_addr}...")
    await server.start()
    
    # Graceful shutdown handler
    await server.wait_for_termination()


if __name__ == "__main__":
    asyncio.run(serve())